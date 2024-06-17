import { createUser, loginUser } from '../services/auth.js';

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

  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expire: 7 * 24 * 60 * 60,
  });
  res.cookie('sessionToken', session.refreshToken, {
    httpOnly: true,
    expire: 7 * 24 * 60 * 60,
  });

  res.json({
    status: 200,
    message: 'Successfully login user!',
    data: { accessToken: session.accessToken },
  });
};
