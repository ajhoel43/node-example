/**
 * PostgreSQL Helper
 * 
 * to Perform PostgreSQL Queries
 */
import { Pool, Client, ConnectionConfig, QueryResult } from 'pg';
import format from 'pg-format';
import dotenv from 'dotenv';

dotenv.config();

export let pool: Pool;
export let client: Client;

const defaultConfig: ConnectionConfig = {
  host: process.env.PG_HOST,
  port: parseInt(process.env.PG_PORT || ''),
  user: process.env.PG_USER,
  password: process.env.PG_PASS,
  database: process.env.PG_DB
}

// Pool Created by Default
pool = new Pool(defaultConfig)

export function initConnection(dbConfig?: ConnectionConfig) {
  pool = new Pool(defaultConfig);
}

export interface insertParams {
  table: string,
  columns: object,
  values: string[][], // Allow Multidimension Array with String as Values
  returnCols?: string[], // this mean Single Dimension Array with String Value
}

export interface updateParams {
  table: string,
  columns: string[],
  values: string[],
  filter: queryFilter,
  returnCols?: string[]
}

export interface deleteParams {
  table: string,
  filter: queryFilter
}

interface queryFilter {
  [index: string]: any
}

export interface dbResult {
  error: number,
  message?: string,
  data?: object,
}

// TODO: Finish this
export function selectQuery() {

}

/**
 * Build & Execute POSTGRESQL Insert Statement (Support Bulk Insert)
 * @param params Insert Statement Parameter 
 * @returns Promise
 */
export function insertQuery(params: insertParams): Promise<QueryResult> {
  // Build Query
  let qStr = `INSERT INTO %I (${params.columns}) VALUES %L`;

  let qReturnCols = _buildReturnClause(params.returnCols);
  qStr += qReturnCols;

  qStr = format(qStr, params.table, params.values);

  return new Promise((resolve, reject) => {
    pool.query(qStr).then((result) => {
      // console.log("Insert Result", result);
      resolve(result);
    }).catch((err) => {
      // console.warn("Pool Query Catch", err.message);
      reject(err);
    });
  });
}

/**
 * Build & Execute POSTGRESQL Update Statement (Only support single Update for now)
 * @param params Query Update Parameters
 * @returns Promise
 */
export function updateQuery(params: updateParams): Promise<QueryResult> {
  return new Promise((resolve, reject) => {
    let qStr = `UPDATE %I`;

    qStr += _buildSetClause(params.columns, params.values); // Build SET Clause
    qStr += _buildWhereClause(params.filter); // Build WHERE Clause
    qStr += _buildReturnClause(params.returnCols);
    qStr = format(qStr, params.table);

    // console.log("Query", qStr);

    pool.query(qStr).then((result) => {
      // console.log("Update Result", result);
      resolve(result);
    }).catch((err) => {
      reject(err);
    });
  });
}

export function deleteQuery(params: deleteParams): Promise<QueryResult> {
  return new Promise((resolve, reject) => {
    let qStr = `DELETE FROM %I`;

    qStr += _buildWhereClause(params.filter);
    qStr = format(qStr, params.table);

    pool.query(qStr).then((result) => {
      resolve(result);
    }).catch((err) => {
      reject(err);
    });
  });
}

/**
 * Build Query part for Set Clause
 * @param columns Columns to be Updated
 * @param values Values to be settled
 * @returns Query Set Clause
 */
function _buildSetClause(columns: string[], values: string[]) {
  let qPart = '';
  let qSet = columns.map((col, key) => {
    return format(`%I = %L`, col, values[key]);
  }).join(', ');

  qPart += ` SET ${qSet}`;

  return qPart;
}

/**
 * Build Query part for Where Clause
 * @param filter Query Filter Parameters
 * @returns Query Where Clause 
 */
function _buildWhereClause(filter?: queryFilter) {
  let qPart = '';
  if (filter && Object.keys(filter).length > 0) {
    let qWhere = Object.keys(filter).map((val) => {
      return format(`%I = %L`, val, filter[val]);
    }).join(' AND ');

    qPart += ` WHERE ${qWhere}`;
  }

  return qPart;
}

/**
 * Build Query Part for Returning Fields
 * @param cols Table Columns
 * @return String Query Part for RETURNING
 */
function _buildReturnClause(cols?: string[]) {
  let qPart = '';
  if (cols && cols.length > 0) {
    let fields = cols.map((val) => {
      return `${val}`;
    }).join(',');
    qPart += ` RETURNING ${fields}`;
  }

  return qPart;
}

export function prepResult(error: number, data: any): dbResult {
  let result = {
    error, message: '', data: {}
  };

  result.message = error == 1 ? data : 'Success';
  result.data = error == 1 ? {} : data;

  return result;
}