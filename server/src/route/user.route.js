import { Router } from "express";
import {registerUser, loginUser, logoutUser, getCurrentUser} from '../controller/user.controller.js'
import { verifyJWT } from "../middleware/user.middlewaare.js";

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', verifyJWT, logoutUser);
router.get('/me', verifyJWT, getCurrentUser);

export default router;