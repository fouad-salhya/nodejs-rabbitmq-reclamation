import { authMiddleware, isAdmin } from './../middlewares/authMiddleware';
import { Router } from 'express';
import { getAllUsers, getUserById} from '../controllers/userController'

const router = Router();

router.get('/all', [authMiddleware, isAdmin], getAllUsers)
router.get('/:id', getUserById)


export default router;


// exmples

