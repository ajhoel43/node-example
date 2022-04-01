import { Request, Response } from "express";

export function getPost(req: Request, res: Response) {
  console.log("Get Post Controller Works");
  res.send("Get Post Controller Works");
}