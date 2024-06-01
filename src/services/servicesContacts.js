import { ContactsSchema } from '../db/contact.js';

import mongoose from 'mongoose';

export const getAllContacts = async () => {
  const contacts = await ContactsSchema.find();
  return contacts;
};

export const getContactById = async (contactId) => {
  const contact = await ContactsSchema.findById(contactId);
  if (!mongoose.Types.ObjectId.isValid(contactId)) {
    return res.status(404).json({
      status: 404,
      message: `Contact with id ${contactId} not found!`,
    });
  } else return contact;
};
