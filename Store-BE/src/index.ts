import 'dotenv/config';
import { appInstance } from './app.js';

await appInstance.initialize();
appInstance.listen();
