import { User } from '../db/User.js';
import bcrypt from 'bcrypt';

export const createUser = async (payload) => {
  const hashedPassword = await bcrypt.hash(payload.password, 10);
  return await User.create({ ...payload, password: hashedPassword });
};
