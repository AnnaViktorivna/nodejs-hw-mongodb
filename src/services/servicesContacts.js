import { ContactsSchema } from '../db/contact';

export const getAllContacts = async () => {
  const contacts = await ContactsSchema.find();
  return contacts;
};

export const getContactById = async (contactID) => {
  const contact = await ContactsSchema.findById(contactID);
  return contact;
};
