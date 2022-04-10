/**
 * This is Province Controller
 *  - should contain base logic of area
 */
// TODO: Functional CRUD
import { Request, Response } from "express";
import { createProvince, deleteProvince, readProvinces, updateProvince } from "../models/provModel";

export async function getProvinces(req: Request, res: Response) {
  let prov = await readProvinces();
  res.send(prov);
}

export async function addProvince(req: Request, res: Response) {
  let result = await createProvince(req.body);

  if (result.error == 1) {
    res.status(403).json(result);
  } else {
    res.json(result);
  }
}

export async function editProvince(req: Request, res: Response) {
  let result = await updateProvince(req.body, req.params.prov_id);
  res.status(result.error == 0 ? 200 : 403).json(result);
}

export async function removeProvince(req: Request, res: Response) {
  let result = await deleteProvince(req.params.prov_id);
  res.status(result.error == 0 ? 200 : 403).json(result);
}
