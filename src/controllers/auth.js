import { createUser } from '../services/auth.js';

export const registerUser = async (req, res) => {
  const user = await createUser(req.body);
  res.json({
    status: 200,
    message: 'Successfully created a user!',
    data: user,
  });
};
