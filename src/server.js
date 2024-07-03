import cors from 'cors';

import express from 'express';
import pino from 'pino-http';
import { env } from './utils/env.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import rootRouter from './routers/index.js';
import cookieParser from 'cookie-parser';
import { ENV_VARS, UPLOAD_DIR } from './constants/index.js';
import { swagger } from './middlewares/swagger.js';

// import { swagger } from './middlewares/swagger.js';

export function setupServer() {
  const app = express();

  app.use('/api-docs', swagger());
  // Assuming your swagger.json is located in 'docs' directory
  // app.use(
  //   '/swagger.json',
  //   express.static(path.join(process.cwd(), 'docs', 'swagger.json')),
  // );

  app.use(cors());
  app.use(cookieParser());

  app.use(
    express.json(
      express.json({
        type: ['application/json'],
        limit: '100kb',
      }),
    ),
  );

  // app.use(
  //   pino({
  //     transport: {
  //       target: 'pino-pretty',
  //     },
  //   }),
  // );
  // app.use('/uploads', express.static(UPLOAD_DIR));

  app.use(rootRouter);

  app.use('*', notFoundHandler);

  app.use(errorHandler);

  // const PORT = env('PORT', 3000);
  const PORT = env(ENV_VARS.PORT, 5050);

  app.listen(PORT, () => {
    console.log(
      `Server is running on port ${PORT}. Please open http://localhost:${PORT}/contacts/  or open example contact with id http://localhost:${PORT}/contacts/665750ca186de6756cbc2ca7/ in your browser.`,
    );
  });
}
