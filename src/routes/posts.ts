import { Router, Response, Request } from "express";
import { getPost } from '../controllers/posts';

const router = Router();

router.get('/', getPost);
router.get('/unyil', (req: Request, res: Response) => {
  res.send("Hello Unyill");
});

export default router;