import {Router} from 'express'
import auth from '../middleware/auth.js'
import {
    createUser,
    getUserByToken
} from '../controllers/userController.js'

const router = Router();

//GET user by token (use after login/signup generates token)
router.get('/me', auth, getUserByToken)

//POST user (Use for signup portal)
router.post('/', createUser);

export default router;