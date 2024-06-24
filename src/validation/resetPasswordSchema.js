import Joi from 'joi';

export const resetPasswordSchema = Joi.object({
  password: Joi.string().min(3).max(15).required(),
  token: Joi.string().required(),
});
