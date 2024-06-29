import { TEMP_UPLOAD_DIR, UPLOAD_DIR } from './constants/index.js';
import { initMongoDB } from './db/initMongoConnection.js';
import { setupServer } from './server.js';
import { createFolderIfDoesNotExist } from './utils/createFolderIfDoesNotExist.js';

const bootstrap = async () => {
  await initMongoDB();
  await createFolderIfDoesNotExist(TEMP_UPLOAD_DIR);
  await createFolderIfDoesNotExist(UPLOAD_DIR);
  setupServer();
};

bootstrap();
