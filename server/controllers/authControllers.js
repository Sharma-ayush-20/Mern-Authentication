import userModel from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken'
import transporter from "../config/nodemailer.js";

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

        //sending welcome email
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: 'Welcome to Mern-Auth',
            text: `Welcome to Mern-Auth Website. Your account has been created with email id: ${email}`
        }

        await transporter.sendMail(mailOptions)

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

//send verification OTP to the user's email
export const sendVerifyOtp = async (req, res) => {
    try {

        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User Not Found"
            })
        }

        const user = await userModel.findById(userId);

        if (user.isAccountVerified) {
            return res.status(400).json({
                success: false,
                message: "Account already Verified"
            })
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000))

        user.verifyOtp = otp
        user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000

        await user.save()

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Account Verification OTP',
            text: `Your OTP is ${otp}. Verify your account using this OTP.`
        }

        await transporter.sendMail(mailOptions);

        return res.status(200).json({
            success: true,
            message: "Verification OTP Sent on Email"
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

//verify user email with OTP
export const verifyEmail = async (req, res) => {
    try {

        const { userId, otp } = req.body;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User Not Found"
            })
        }

        if (!otp) {
            return res.status(400).json({
                success: false,
                message: "Please enter otp"
            })
        }

        const user = await userModel.findById(userId)

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User Not Found"
            })
        }

        const userSendOtp = otp;
        const userOriginalOtp = user.verifyOtp;
        const expireOtpDate = user.verifyOtpExpireAt;
        const currentDate = Date.now();

        if (user.verifyOtp === '' || userSendOtp !== userOriginalOtp) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP"
            })
        }

        if (currentDate > expireOtpDate) { //23 > 24
            return res.status(400).json({
                success: false,
                message: "OTP is Expire. Resend Otp"
            })
        }

        user.isAccountVerified = true
        user.verifyOtp = ""
        user.verifyOtpExpireAt = 0

        await user.save()

        return res.status(200).json({
            success: true,
            message: "User email verify successfully"
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

//check if user is authenticated
export const isAuthenticated = async (req, res) => {
    try {

        return res.json({
            success: true,
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}