import createHttpError from 'http-errors';
import { isValidObjectId } from 'mongoose';
import {
  createContact,
  getAllContacts,
  getContactById,
} from '../services/servicesContacts.js';

export const getContactsController = async (req, res) => {
  const contacts = await getAllContacts();
  console.log(contacts);
  res.json({
    status: 200,
    message: 'Successfully get all contacts!',
    data: contacts,
  });
};

export const getContactsByIDController = async (req, res, next) => {
  const { contactId } = req.params;

  if (!isValidObjectId(contactId)) {
    next(createHttpError(400, `Contact with id ${contactId} not found!`));
    return;
  }

  const contact = await getContactById(contactId);

  if (!contact) {
    next(createHttpError(404, `Contact  not found!`));
    return;
  }

  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};

export const createContactController = async (req, res) => {
  const contact = await createContact(req.body);

  res.status(201).json({
    status: 201,
    message: `Successfully created a contact!`,
    data: contact,
  });
};
