import { Router } from "express";
import { 
  createGig, 
  updateGig, 
  getAllGig, 
  getGigById, 
  deleteGig, 
  acceptGigFreelancer,
  getMyGigs
} from "../controller/gig.controller.js";
import { verifyJWT } from "../middleware/user.middlewaare.js";

const router = Router();

router.get("/", getAllGig);

router.post("/", verifyJWT, createGig);
router.get("/user/mygigs", verifyJWT, getMyGigs);
router.get("/:id", getGigById);
router.put("/:id", verifyJWT, updateGig);
router.delete("/:id", verifyJWT, deleteGig);

router.patch("/:id/hire", verifyJWT, acceptGigFreelancer);

export default router;
