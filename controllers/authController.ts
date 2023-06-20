import { loginSchema, registerSchema } from "../utils/form_validation/auth";
import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
const User = require("../models/userModel");

const registerController = async (req: Request, res: Response) => {
    const { error } = registerSchema.validate(req.body);
    if (error) {
        return res.status(400).json({
            status: 400,
            message: error?.details[0]?.message
        });
    }

    //Check if the user is already in the db
    const emailExists = await User.findOne({ email: req.body.email });

    if (emailExists) {
        return res.status(400).json({ status: 400, message: "Email already exists" });
    }

    //hash passwords
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    //create new user
    const user = new User({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: hashPassword,
    });

    try {
        const savedUser = await user.save();
        res.json({
            data: savedUser,
            message: 'User successfully registered',
            status: 201
        });
    } catch (err) {
        res.status(500).json(err);
    }
}

const loginController = async (req: Request, res: Response) => {
    const { error } = loginSchema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await User.findOne({ email: req.body.email });

    if (!user) return res.status(400).json({ status: 400, message: "User not found!" });

    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) return res.status(400).json({ status: 400, message: "Password is incorrect" });

    //Create and assign a token
    const token = jwt.sign({ _id: user._id }, 'sfadfadfad');
    res.header("auth-token", token).json({ status: 200, token, message: 'Token gotten successfully' });
}

module.exports = {
    registerController, loginController
}