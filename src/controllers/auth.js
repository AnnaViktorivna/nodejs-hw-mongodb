import {
  createUser,
  logOut,
  loginUser,
  refreshSession,
  requestResetEmailPassword,
  resetPassword,
} from '../services/auth.js';

const setupSessionCookies = (res, session) => {
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expire: 7 * 24 * 60 * 60,
  });
  res.cookie('sessionToken', session.refreshToken, {
    httpOnly: true,
    expire: 7 * 24 * 60 * 60,
  });
};
export const registerUser = async (req, res) => {
  const user = await createUser(req.body);

  res.json({
    status: 200,
    message: 'Successfully created a user!',
    data: { user },
  });
};

export const loginUserController = async (req, res) => {
  const session = await loginUser(req.body);

  setupSessionCookies(res, session);
  res.json({
    status: 200,
    message: 'Successfully login user!',
    data: { accessToken: session.accessToken },
  });
};

export const logOutController = async (req, res) => {
  await logOut({
    sessionId: req.cookies.sessionId,
    sessionToken: req.cookies.sessionToken,
  });

  res.clearCookie('sessionId');
  res.clearCookie('sessionToken');

  res.status(204).send();
};

export const refreshTokenController = async (req, res) => {
  const { sessionId, sessionToken } = req.cookies;
  const session = await refreshSession({ sessionId, sessionToken });

  setupSessionCookies(res, session);

  res.json({
    status: 200,
    message: 'Successfully refresh token!',
    data: { accessToken: session.accessToken },
  });
};

export const sendResetEmailController = async (req, res) => {
  const data = await requestResetEmailPassword(req.body.email);
  res.json({
    message: 'Reset password email was successfully sent!',
    status: 200,
    data: data,
  });
};

export const resetPasswordController = async (req, res) => {
  await resetPassword(req.body);
  res.json({
    message: 'Reset password was successfully done!',
    status: 200,
    data: {},
  });
};
