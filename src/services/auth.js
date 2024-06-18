import createHttpError from 'http-errors';
import { User } from '../db/User.js';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { Session } from '../db/session.js';

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
