import { Router } from "express";
import {registerUser, loginUser, logoutUser} from '../controller/user.controller.js'
import { verifyJWT } from "../middleware/user.middlewaare.js";

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', verifyJWT, logoutUser)

export default router;