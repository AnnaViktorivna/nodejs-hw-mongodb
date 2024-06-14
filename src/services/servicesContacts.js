import createHttpError from 'http-errors';
import { ContactsSchema } from '../db/contact.js';

import mongoose from 'mongoose';

export const createPaginationInfo = (page, perPage, total) => {
  const totalPage = Math.ceil(total / perPage);
  const prevPage = page > 1;
  const nextPage = page < totalPage;
  return { page, perPage, totalItems: total, totalPage, prevPage, nextPage };
};

export const getAllContacts = async ({
  page = 1,
  perPage = 5,
  sortBy = '_id',
  sortOrder = 'asc',
}) => {
  const skip = perPage * (page - 1);
  // const contactCount = await ContactsSchema.find().countDocuments();
  // const contacts = await ContactsSchema.find().skip(skip).limit(perPage);

  const [contactCount, contacts] = await Promise.all([
    ContactsSchema.find().countDocuments(),
    ContactsSchema.find()
      .skip(skip)
      .limit(perPage)
      .sort({ [sortBy]: sortOrder }),
  ]);

  const paginationInfo = createPaginationInfo(page, perPage, contactCount);

  return { contacts, ...paginationInfo };
};

export const getContactById = async (contactId) => {
  const contact = await ContactsSchema.findById(contactId);
  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }
  return contact;
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
