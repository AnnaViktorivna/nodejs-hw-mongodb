import cors from 'cors';
import express from 'express';
import pino from 'pino-http';
import { env } from './utils/env.js';
import { getAllContacts } from './services/servicesContacts.js';
import { getContactById } from './services/servicesContacts.js';

// Read envariables variables PORT
// const portValue = env('PORT', 3000);
// const PORT = parseInt(env('PORT', 3000), 10);
// if (isNaN(PORT) || PORT < 0 || PORT > 65535) {
//   throw new RangeError(
//     `Invalid PORT: ${PORT}. Port should be a number between 0 and 65535.`,
//   );
// }

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

  app.get('/contacts/:contactID', async (req, res) => {
    const { contactID } = req.params;
    const contact = await getContactById(contactID);

    res.status(200).json({
      data: contact,
    });
  });

  app.use('*', (req, res, next) => {
    res.status(404).json({
      message: 'Not found',
    });
  });

  app.use((er, req, res, next) => {
    res.status(500).json({
      message: 'Something went wrong',
      error: err.message,
    });
  });

  const PORT = env('PORT', 3000);

  app.listen(PORT, () => {
    console.log(
      `Server is running on port ${PORT}. Please open http://localhost:${PORT} in your browser.`,
    );
  });
}
