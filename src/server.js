import cors from 'cors';
import express from 'express';
import pino from 'pino-http';
import { env } from './utils/env.js';
import contactsRouters from './routers/routersContacts.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';

export function setupServer() {
  const app = express();

  app.use(cors());

  app.use(
    express.json(
      express.json({
        type: ['application/json'],
        limit: '100kb',
      }),
    ),
  );

  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.use(contactsRouters);

  app.use('*', notFoundHandler);

  app.use(errorHandler);

  const PORT = env('PORT', 3000);

  app.listen(PORT, () => {
    console.log(
      `Server is running on port ${PORT}. Please open http://localhost:${PORT}/contacts/  or open example contact with id http://localhost:${PORT}/contacts/665750ca186de6756cbc2ca7/ in your browser.`,
    );
  });
}
