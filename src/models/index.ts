import mysql, { MysqlError, ConnectionConfig, Connection, QueryOptions, format } from 'mysql';
import dotenv from 'dotenv';

interface dbConfig {
  host: string,
  port?: number,
  user: string,
  password: string,
  database?: string
}

dotenv.config();

const defaultConfig: ConnectionConfig = {
  host: process.env.MYSQL_HOST,
  port: 8010,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASS,
  database: process.env.MYSQL_DB
};

// const db = mysql.createConnection();
export let db: Connection;

export function connectDB(opt?: ConnectionConfig) {
  let dbOpt = opt || defaultConfig;

  db = mysql.createConnection(dbOpt);

  db.connect((err: MysqlError) => {
    if (err) {
      console.log("MYSQL Error", err.message);
      return;
    } else {
      console.log("MYSQL Connection Success");
    }
  });
}

export function disconnectDB() {
  db.end();
}

export function queryExec(opts: QueryOptions) {
  return new Promise((resolve, reject) => {
    connectDB();

    db.query(db.format(opts.sql, opts.values), (err, results) => {
      if (err) reject(err);

      // console.log("Results: ", results);
      resolve(results);
    });

    disconnectDB();
  });
}