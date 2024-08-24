import { authMiddleware, isAdmin } from './../middlewares/authMiddleware';
import { Router } from 'express';
import { getAllUsers, getUserById, updateUser} from '../controllers/userController'

const router = Router();

router.get('/all', [authMiddleware, isAdmin], getAllUsers)
router.get('/:id',[authMiddleware,updateUser], getUserById)


export default router;


// exmples

