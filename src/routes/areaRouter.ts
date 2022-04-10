import { Router } from 'express';
import {
  getProvinces,
  addProvince,
  editProvince,
  removeProvince
} from '../controllers/provController';

const router = Router();

router.get('/provinces', getProvinces);
router.post('/provinces', addProvince);
router.put('/provinces/:prov_id', editProvince);
router.delete('/provinces/:prov_id', removeProvince);

router.get('/cities', getProvinces);
router.get('/district', getProvinces);
router.get('/village', getProvinces);

export default router;