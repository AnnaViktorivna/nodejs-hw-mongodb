import createHttpError from 'http-errors';
import { ContactsSchema } from '../db/models/contact.js';

import mongoose from 'mongoose';
import { saveFileToLocalMachine } from '../utils/saveFile.js';
import { saveToCloudiary } from '../utils/saveToCloudiary.js';

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
  userId,
}) => {
  const skip = perPage * (page - 1);
  // const contactCount = await ContactsSchema.find().countDocuments();
  // const contacts = await ContactsSchema.find().skip(skip).limit(perPage);

  // const contactFilter = ContactsSchema.find();
  // contactFilter.where('userId').equals(userId);

  const [contactCount, contacts] = await Promise.all([
    ContactsSchema.find({ userId }).countDocuments(),
    ContactsSchema.find({ userId })
      .skip(skip)
      .limit(perPage)
      .sort({ [sortBy]: sortOrder }),
  ]);

  const paginationInfo = createPaginationInfo(page, perPage, contactCount);

  return { data: contacts, ...paginationInfo };
};

export const getContactById = async (contactId, userId) => {
  const contact = await ContactsSchema.findOne({
    _id: contactId,
    userId: userId,
  });
  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }
  return contact;
};

export const createContact = async ({ photo, ...payload }, userId) => {
  // const url = await saveFileToLocalMachine(avatar);
  const url = await saveToCloudiary(photo);

  const contact = await ContactsSchema.create({
    userId,
    ...payload,
    photo: url,
  });

  return contact;
};

export const updateContact = async (
  id,
  { photo, ...payload },
  options = {},
) => {
  const url = await saveToCloudiary(photo);

  const rawResult = await ContactsSchema.findByIdAndUpdate(
    id,
    { ...payload, photo: url },
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

export const deleteContact = async (contactId, userId) => {
  if (!mongoose.Types.ObjectId.isValid(contactId)) {
    throw createHttpError(404, `Contact with id ${contactId} not found!`);
  }
  const contact = await ContactsSchema.findByIdAndDelete({
    _id: contactId,
    userId,
  });
  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }

  return contact;
};
