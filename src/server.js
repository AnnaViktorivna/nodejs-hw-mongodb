import cors from 'cors';
import express from 'express';
import pino from 'pino-http';
import { env } from './utils/env.js';
import { getAllContacts } from './services/servicesContacts.js';
import { getContactById } from './services/servicesContacts.js';

export function setupServer() {
  const app = express();

  app.use(express.json());
  app.use(cors());

  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.get('/contacts', async (req, res) => {
    const contacts = await getAllContacts();
    console.log(contacts);
    res.json({
      status: 200,
      message: 'Successfully get all contacts!',
      data: contacts,
    });
  });

  app.get('/contacts/:contactId', async (req, res) => {
    const { contactId } = req.params;
    const contact = await getContactById(contactId);

    if (!contact) {
      return res.status(400).json({
        status: 400,
        message: `Contact with id ${contactId} not found!`,
      });
    }
    res.status(200).json({
      status: 200,
      message: `Successfully found contact with id ${contactId}!`,
      data: contact,
    });
  });

  app.use((req, res) => {
    res.status(404).send('Oops! Route was not found!');
  });

  app.use((error, req, res, next) => {
    res.status(500).send(error.message);
  });

  const PORT = env('PORT', 3000);

  app.listen(PORT, () => {
    console.log(
      `Server is running on port ${PORT}. Please open http://localhost:${PORT}/contacts/  in your browser.`,
    );
  });
}
