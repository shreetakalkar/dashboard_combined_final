import { Router } from "express";
import * as clientController from "../controllers/client.controller.js";

const router = Router();

// Example route - adjust as needed
router.get("/", (req, res) => {
  res.json({ message: "Client route is working" });
});

// Add client-related routes here, for example:
// router.get("/:id", clientController.getClientById);
// router.post("/", clientController.createClient);

export default router;
