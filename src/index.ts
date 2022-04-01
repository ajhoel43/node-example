import express from 'express';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import dotenv from 'dotenv';

import initRouter from './routes';

dotenv.config();

const app = express();
const bParserParams = { limit: '30mb', extended: true };

app.use(helmet());
app.use(bodyParser.json(bParserParams));
app.use(bodyParser.urlencoded(bParserParams));

initRouter(app);

app.listen(process.env.NODE_PORT || 3000, () => console.log("Server Running") );