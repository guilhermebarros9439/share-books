// Node modules
import express from 'express';
import cors from 'cors';

// Local modules
import routes from './routes';

// Express configs
const app = express();

app.use(express.json());
app.use(cors());

app.use(routes);
app.use('/uploads', express.static('uploads'));

// Run server
app.listen(3333);