import { authMiddleware, isAdmin } from './../middlewares/authMiddleware';
import { Router } from 'express';
import { getAllUsers, getUserById, updateUser} from '../controllers/userController'

const router = Router();

router.get('/all', [authMiddleware, isAdmin, updateUser], getAllUsers)
router.get('/:id', getUserById)


export default router;


// exmples

