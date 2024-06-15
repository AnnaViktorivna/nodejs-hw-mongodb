import { Router } from 'express';
import router from './routersContacts.js';
import authRouter from './auth.js';

const rootRouter = Router();

rootRouter.use('/contacts', router);
rootRouter.use('/auth', authRouter);

export default rootRouter;
