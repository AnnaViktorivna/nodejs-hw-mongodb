import Joi from 'joi';

export const createContactSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  phoneNumber: Joi.string()
    .length(10)
    .pattern(/^[0-9]+$/)
    .required(),
  email: Joi.string().email().required(),
  contactType: Joi.string().valid('personal', 'home', 'other').required(),
  isFavourite: Joi.boolean(),
});
