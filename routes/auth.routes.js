import express from "express";
import { login, logout } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/login", login);
router.post("/logout", logout);
router.get("/me", (req, res) => {
  if (req.session.user) {
    return res.json(req.session.user);
  }
  return res.json({ role: "read" });
});
export default router;
