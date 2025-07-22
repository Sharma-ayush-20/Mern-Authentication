import userModel from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken'

export const register = async (req, res) => {
    try {

        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please fill all details properly."
            })
        }

        const existedUser = await userModel.findOne({ email })

        if (existedUser) {
            res.status(400).json({
                success: false,
                message: "Email already existed. Try with another."
            })
        }

        const salt = 10;
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new userModel({ name, email, password: hashedPassword })

        await newUser.save()

        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' })

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })

        return res.status(200).json({
            success: true,
            message: "User Created SuccessFully"
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

export const login = async (req, res) => {
    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please fill all details properly.",
            })
        }

        const user = await userModel.findOne({ email })

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Email is incorrect",
            })
        }

        const isMatchPassword = await bcrypt.compare(password, user.password)

        if (!isMatchPassword) {
            return res.status(400).json({
                success: false,
                message: "password is incorrect",
            })
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        return res.status(200).json({
            success: true,
            message: "User Login SuccessFully"
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

export const logout = async (req, res) => {
    try {

        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        return res.status(200).json({
            success: true,
            message: "Logged Out"
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}