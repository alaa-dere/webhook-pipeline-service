import express from "express";
import { addSubscriber, getSubscribers } from "./controller.js";

const router = express.Router();

router.post("/subscribers", addSubscriber);

router.get("/subscribers", getSubscribers);

export default router;