import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';
import { User } from '../db/models/User.js';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { Session } from '../db/models/session.js';
import { ENV_VARS } from '../constants/index.js';
import { sendEmail } from '../utils/sendMail.js';
import { env } from '../utils/env.js';
import { ObjectId } from 'mongoose';

const createSession = () => {
  return {
    accessToken: crypto.randomBytes(20).toString('base64'),
    refreshToken: crypto.randomBytes(20).toString('base64'),
    accessTokenValidUntil: Date.now() + 1000 * 60 * 15,
    refreshTokenValidUntil: Date.now() + 1000 * 60 * 60 * 24 * 7,
    // refreshTokenValidUntil: Date.now() + 1000,
  };
};

export const createUser = async (payload) => {
  const user = await User.findOne({ email: payload.email });
  if (user) {
    throw createHttpError(409, 'User already exists');
  }

  const hashedPassword = await bcrypt.hash(payload.password, 10);
  return await User.create({ ...payload, password: hashedPassword });
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    throw createHttpError(401, 'Password is not correct');
  }

  await Session.deleteOne({ userId: user._id });
  // const accessToken = crypto.randomBytes(20).toString('base64');
  // const refreshToken = crypto.randomBytes(20).toString('base64');

  return await Session.create({
    userId: user._id,
    ...createSession(),
  });
  // return { accessToken, refreshToken };
};

export const logOut = async ({ sessionId, sessionToken }) => {
  return await Session.deleteOne({
    _id: sessionId,
    refreshToken: sessionToken,
  });
};

export const refreshSession = async ({ sessionId, sessionToken }) => {
  const session = await Session.findOne({
    _id: sessionId,
    refreshToken: sessionToken,
  });

  if (!session) {
    throw createHttpError(401, 'Session not found');
  }

  if (Date.now() > session.refreshTokenValidUntil) {
    throw createHttpError(401, 'Session expired');
  }

  const user = await User.findById(session.userId);

  if (!user) {
    throw createHttpError(401, 'User not found');
  }

  await Session.deleteOne({
    _id: sessionId,
  });

  return await Session.create({
    userId: user._id,
    ...createSession(),
  });
};

export const requestResetEmailPassword = async (email) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const resetToken = jwt.sign(
    {
      sub: user._id,
      email,
    },
    env(ENV_VARS.JWT_SECRET),
    {
      expiresIn: '5m',
    },
  );

  try {
    await sendEmail({
      html: `
    <h1>Hello!</h1>
      <p>You requested a password reset
        <a href="${env(
          ENV_VARS.APP_DOMAIN,
        )}/reset-password?token=${resetToken}">Click here</a>
      </p>
    `,
      from: env(ENV_VARS.SMTP_FROM),
      to: email,
      subject: 'Reset password',
    });
  } catch (err) {
    throw createHttpError(500, 'Failed to send email');
  }

  return { resetToken };
};

export const resetPassword = async ({ token, password }) => {
  let tokenPayload;
  try {
    tokenPayload = jwt.verify(token, env(ENV_VARS.JWT_SECRET));
  } catch (err) {
    console.log(err);
    throw createHttpError(401, err.message);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.findOneAndUpdate(
    {
      _id: tokenPayload.sub,
      email: tokenPayload.email,
    },
    { password: hashedPassword },
  );

  return user;
};
