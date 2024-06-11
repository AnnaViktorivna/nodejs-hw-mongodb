// src/routers/students.js

import { Router } from 'express';
import {
  createContactController,
  deleteContactController,
  getContactsByIDController,
  getContactsController,
  patchContactController,
} from '../controllers/controllersContacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateId } from '../middlewares/validateId.js';

const router = Router();

router.use('/contacts/:contactId', validateId('contactId'));

router.get('/contacts', ctrlWrapper(getContactsController));

router.get(
  '/contacts/:contactId',

  ctrlWrapper(getContactsByIDController),
);
router.post(
  '/contacts',

  ctrlWrapper(createContactController),
);
router.patch(
  '/contacts/:contactId',

  ctrlWrapper(patchContactController),
);
router.delete(
  '/contacts/:contactId',

  ctrlWrapper(deleteContactController),
);

export default router;
