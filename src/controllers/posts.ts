import { Request, Response } from "express";
import { QueryOptions, format } from "mysql";
import { queryExec } from "../models";

export function getPost(req: Request, res: Response) {
  let myQ: QueryOptions = {
    sql: `SELECT id, username, name FROM ?? WHERE ?? LIKE ?`,
    values: ['users', 'username', '%impor%'],
  }

  let user_data = queryExec(myQ).then((result) => {
    console.log("User data", result);
    res.send(result);
  }).catch((err) => {
    console.log("Query Fail", err);
    res.send({ error: err.message });
  });
}