import { ContactsSchema } from '../db/contact.js';

export const getAllContacts = async () => {
  const contacts = await ContactsSchema.find();
  return contacts;
};

export const getContactById = async (contactId) => {
  const contact = await ContactsSchema.findById(contactId);
  return contact;
};
