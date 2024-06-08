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

export const createContact = async (payload) => {
  const contact = await ContactsSchema.create(payload);
  return contact;
};

export const updateContact = async (contactId, payload, options = {}) => {
  const rawResult = await ContactsSchema.findOneAndUpdate(
    { _id: contactId },
    payload,
    {
      new: true,
      includeResultMetadata: true,
      ...options,
    },
  );

  if (!rawResult || !rawResult.value) return null;

  return {
    contactId: rawResult.value,
    isNew: Boolean(rawResult?.lastErrorObject?.upserted),
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
