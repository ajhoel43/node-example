import { Express, Request, Response } from "express";
import postRouter from './posts'
import areaRouter from './areaRouter';

export default function init(app: Express) {
  app.use('/posts', postRouter);
  app.use('/area', areaRouter);
}