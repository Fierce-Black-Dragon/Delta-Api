import express, { Express, Request, Response } from 'express';


import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import morgan from "morgan";

// createError from "http-errors";
dotenv.config();

const app: Express = express();
const port = process.env.PORT||4000;
app.use(cookieParser());
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});