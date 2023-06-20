import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors'

dotenv.config();
const app: Express = express();
const port = process.env.PORT || 8000;

// GLOBAL MIDDLEWARE
app.use(cors()) 
app.use(express.json());

const AuthRoute = require('./routes/authRoute')

mongoose.connect(`${process.env.DB_CONNECTION}`)
  .then(() => console.log('Database Connected!'));

app.get('/', (req: Request, res: Response) => {
    res.send('Hello world')
})

app.use('/auth', AuthRoute)

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
  });