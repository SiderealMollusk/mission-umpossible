import express from 'express';
import cors from 'cors';
import v1 from './routes/v1';

const port = 5176;
const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/v1', v1);

app.listen(port, () => {
  console.log(`mu-api listening on http://localhost:${port}`);
});