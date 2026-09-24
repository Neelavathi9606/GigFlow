import { Router } from "express";
import { 
  createBid, 
  updateBid, 
  deleteBid, 
  getUserBid, 
  getGigBid 
} from "../controller/bid.controller.js";
import { verifyJWT } from "../middleware/user.middlewaare.js";

const router = Router();

router.post("/", verifyJWT, createBid);
router.put("/:id", verifyJWT, updateBid);
router.delete("/:id", verifyJWT, deleteBid);

router.get("/user/mybids", verifyJWT, getUserBid);
router.get("/:gigId", verifyJWT, getGigBid);

export default router;
