import express from "express";
import { Router } from "express";
import { register, login, logout, getProfile, editProfile, getSuggestedUsers, followorUnfollow } from "../controllers/User.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js"
import upload from "../middlewares/multer.js"

const router = Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/:id/profile").get(isAuthenticated, getProfile);
router.route("/profile/edit").post(isAuthenticated, upload.single('profilePicture'), editProfile);
router.route("/suggested").get(isAuthenticated, getSuggestedUsers);
router.route("/followorunfollow/:id").post(isAuthenticated, followorUnfollow);

export default router;