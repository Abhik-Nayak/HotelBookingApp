
import express from "express";
const router = express.Router();
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { createError } from "../utils/error.js";

router.post("/register", async (req, res) => {
    try {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);

        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hash,
        })
        await newUser.save();
        res.json({statusCode: "success"});
    } catch (err) {
        // next(err);
        console.log(err);
    }
})

router.post("/login", async (req, res) => {
    try {
        const user = User.findOne({ username: req.body.username })
        if (!user) return next(createError(404, "User not Found"));

        const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password)
        if (!isPasswordCorrect) return next(createError(400, "Wrong password or username!"));

        const token = jwt.sign(
            { id: user._id, isAdmmin: user.isAdmmin },
            process.env.JWT
        );
        const { password, isAdmmin, ...otherDetails } = user._doc;
        res.cookie("access_token", token, {
            httpOnly: true,
        }).status(200).json({ ...otherDetails });
    } catch (err) {
        next(err);
    }
})

export default router;