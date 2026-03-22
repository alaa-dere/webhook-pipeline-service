import express from "express";
import { addSubscriber, getSubscribers, deleteSubscriber } from "./controller.js";

const router = express.Router();

router.post("/subscribers", addSubscriber);

router.get("/subscribers", getSubscribers);
router.delete("/subscribers/:id", deleteSubscriber);

export default router;
