/**
 * This is Area Model
 *  - should contain Queries
 */

import { QueryOptions } from "mysql";
import { queryExec } from ".";
import {
  dbResult,
  deleteParams,
  deleteQuery,
  insertQuery,
  insertParams,
  prepResult,
  updateQuery,
  updateParams, 
  selectQuery,
  selectParams
} from "./pgHelper";

interface ProvinceData {
  prov_id?: Number,
  prov_name: String,
  country_id?: Number
}

// export async function readProvinces(whereClause?: object) {
//   let qOpts: QueryOptions = {
//     sql: "SELECT prov_id, prov_name FROM provinces WHERE prov_name LIKE ?",
//     values: ['%jawa%']
//   }

//   let result = await queryExec(qOpts);
//   console.log("QRes", result);
//   return result;
// }

export async function readProvinces(params?: object): Promise<dbResult> {
  try {
    let sParams: selectParams = {
      table: 'provinces',
      fields: ['prov_id', 'prov_name'],
      filterLike: params,
    };
    let result = await selectQuery(sParams);
    console.log("readProvinces Model", result);
    return result;
  } catch (error: any) {
    console.log("readProvinces Model", error);
    return error;
  }
}

export async function createProvince(data: ProvinceData) {
  let resultStatus: number = 0,
      resultData: any;

  try {
    let iParams: insertParams = {
      table: 'provinces',
      columns: Object.keys(data),
      values: [Object.values(data)],
      returnCols: ['prov_id', 'prov_name']
    }

    let result = await insertQuery(iParams);
    resultStatus = 0;
    resultData = result.rows[0];
  } catch (error: any) {
    console.warn(`createProvince Error:`, error.message);
    resultStatus = 1;
    resultData = error.message;
  } finally {
    return prepResult(resultStatus, resultData);
  }
}

/**
 * Update Province Data
 * @param data Latest Province data
 * @param id Identifier (Province ID)
 * @returns Result
 */
export async function updateProvince(data: ProvinceData, id: number|string): Promise<dbResult> {
  let resultStatus: number = 0,
      resultData: any;

  try {
    let uParams: updateParams = {
      table: 'provinces',
      columns: Object.keys(data),
      values: Object.values(data),
      filter: {prov_id: id},
      returnCols: ['prov_id', 'prov_name']
    }

    let result = await updateQuery(uParams);
    resultStatus = 0;
    resultData = result.rows[0];
  } catch (error: any) {
    resultStatus = 0;
    resultData = error.message;
  } finally {
    return prepResult(resultStatus, resultData);
  }
}

export async function deleteProvince(id: number|string): Promise<dbResult> {
  let resultStatus: number = 0,
      resultData: any;

  try {
    let dParams: deleteParams = {
      table: 'provinces',
      filter: { prov_id: id }
    }

    let result = await deleteQuery(dParams);
    resultStatus = 0;
    resultData = result;
  } catch (error: any) {
    resultStatus = 1;
    resultData = error.message;
  } finally {
    return prepResult(resultStatus, resultData);
  }
}