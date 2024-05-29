// import { setupServer } from './server.js';

// setupServer();

// // src/index.js

import { initMongoDB } from './db/initMongoConnection.js';
import { setupServer } from './server.js';

const bootstrap = async () => {
  await initMongoDB();
  setupServer();
};

bootstrap();
