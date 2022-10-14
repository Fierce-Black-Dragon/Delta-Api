import express, { Express, Request, Response } from 'express';


import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import auth from "./routes/auth"
require("dotenv").config();
require("./config/db.ts").connect();

const app: Express = express();
const port = process.env.PORT||4000;
app.use(cookieParser());
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
app.use('/api/v1',auth)
app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

//404(route not found) handler and pass to error handler
app.use(async (req: Request, res: Response, next) => {
  res.status(404).send("⚠️ Not Found")
});
//Error handler
app.use((err: { status: any; message: any; }, req: Request, res: Response) => {
  // res.status();
  res.status(err.status || 500).json({  message: err.message});
 
});
app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});