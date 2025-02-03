import { protect } from "@taskly/shared";
import express from "express";

import {
  forgotPassword,
  login,
  resetPassword,
  signup,
  updatePassword,
  validateToken,
  deleteMe,
  logout,
} from "../controllers/auth";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/forgotPassword", forgotPassword);
router.post("/resetPassword/:token", resetPassword);

router.post("/logout", logout);
router.get("/validateToken", validateToken);

router.patch(
  "/updatePassword",
  protect("http://users-srv:5000/api/users"),
  updatePassword
);
router.delete(
  "/deleteMe",
  protect("http://users-srv:5000/api/users"),
  deleteMe
);

export default router;
