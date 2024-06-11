import createHttpError from 'http-errors';
import { Types } from 'mongoose';
import {
  createContact,
  deleteContact,
  getAllContacts,
  getContactById,
  updateContact,
} from '../services/servicesContacts.js';
import { ContactsSchema } from '../db/contact.js';

export const getContactsController = async (req, res) => {
  const contacts = await getAllContacts();
  console.log(contacts);
  res.json({
    status: 200,
    message: 'Successfully get all contacts!',
    data: contacts,
  });
};

export const getContactsByIDController = async (req, res) => {
  const { contactId } = req.params;

  // if (!Types.ObjectId.isValid(contactId)) {
  //   throw createHttpError(400, 'Id is not found!');
  // }

  const contact = await getContactById(contactId);

  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};

export const createContactController = async (req, res) => {
  const contact = await createContact(req.body);
  // console.log(contact);
  res.status(201).json({
    status: 201,
    message: `Successfully created a contact!`,
    data: contact,
  });
};

export const patchContactController = async (req, res) => {
  const { body } = req;
  const { contactId } = req.params;
  const { contact } = await updateContact(contactId, body);

  res.status(200).json({
    status: 200,
    message: `Successfully patched a contact!`,
    data: contact,
  });
};

export const deleteContactController = async (req, res, next) => {
  const { contactId } = req.params;

  const contact = await deleteContact(contactId);

  if (!contact) {
    next(createHttpError(404, `Not found!`));
    return;
  }

  res.status(204).send();
};
