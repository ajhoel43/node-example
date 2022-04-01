import { Express, Request, Response } from "express";
import postRouter from './posts'

export default function init(app: Express) {
  app.use('/posts', postRouter);
}