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
import { validateBody } from '../middlewares/validateBody.js';
import { createContactSchema } from '../validation/createContactSchema.js';
import { updateContactSchema } from '../validation/updateContactSchema.js';
import { authenticate } from '../middlewares/authenticate.js';
import { upload } from '../middlewares/upload.js';

const router = Router();

router.use('/:contactId', validateId('contactId'));

router.use(authenticate);

router.get('/', ctrlWrapper(getContactsController));

router.get(
  '/:contactId',

  ctrlWrapper(getContactsByIDController),
);
router.post(
  '/',
  upload.single('avatar'),
  validateBody(createContactSchema),
  ctrlWrapper(createContactController),
);
router.patch(
  '/:contactId',
  upload.single('avatar'),
  validateBody(updateContactSchema),
  ctrlWrapper(patchContactController),
);
router.delete(
  '/:contactId',

  ctrlWrapper(deleteContactController),
);

export default router;
