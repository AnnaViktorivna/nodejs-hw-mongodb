import Joi from 'joi';

export const updateContactSchema = Joi.object({
  name: Joi.string().min(3).max(30),
  phoneNumber: Joi.string()
    .length(10)
    .pattern(/^[0-9]+$/),
  email: Joi.string().email(),
  contactType: Joi.string().valid('personal', 'home', 'other'),
  isFavourite: Joi.boolean(),
});
