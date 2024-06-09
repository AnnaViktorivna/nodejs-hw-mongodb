import { ContactsSchema } from '../db/contact.js';

import mongoose from 'mongoose';

export const getAllContacts = async () => {
  const contacts = await ContactsSchema.find();
  return contacts;
};

export const getContactById = async (contactId) => {
  const contact = await ContactsSchema.findById(contactId);
  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }
  return contact;
  // if (!mongoose.Types.ObjectId.isValid(contactId)) {
  //   return res.status(404).json({
  //     status: 404,
  //     message: `Contact with id ${contactId} not found!`,
  //   });
  // } else return contact;
};

export const createContact = async (payload) => {
  const contact = await ContactsSchema.create(payload);
  return contact;
};

export const updateContact = async (contactId, payload, options = {}) => {
  const rawResult = await ContactsSchema.findByIdAndUpdate(
    { _id: contactId },
    payload,
    {
      new: true,
      includeResultMetadata: true,
      ...options,
    },
  );

  if (!rawResult || !rawResult.value) {
    throw createHttpError(404, 'Contact not found');
  }

  return {
    contact: rawResult.value,
    isNew: !rawResult?.lastErrorObject?.updatedExisting,
  };
};

export const deleteContact = async (contactId) => {
  const contact = await ContactsSchema.findByIdAndDelete({
    _id: contactId,
  });
  if (!mongoose.Types.ObjectId.isValid(contactId)) {
    return res.status(404).json({
      status: 404,
      message: `Contact with id ${contactId} not found!`,
    });
  } else return contact;
};
