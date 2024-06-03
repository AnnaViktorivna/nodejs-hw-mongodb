// src/routers/students.js

import { Router } from 'express';
import {
  createContactController,
  getContactsByIDController,
  getContactsController,
} from '../controllers/controllersContacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const router = Router();

router.get('/contacts', ctrlWrapper(getContactsController));

router.get('/contacts/:contactId', ctrlWrapper(getContactsByIDController));
router.post('/students', ctrlWrapper(createContactController));

export default router;
