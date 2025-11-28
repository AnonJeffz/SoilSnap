import { createSecretToken } from "../util/SecretToken.js";
import User from "../models/user-model.js";
import mail from "../config/mail.js"; 
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { generateOtpHtml, successMessage } from "../config/OTPmessage.js";

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if(!email || !password ){
            return res.status(400).json({success: false, message:'All fields are required'})
        }
        const user = await User.findOne({ email });
        if(!user){
            return res.status(404).json({success: false, message:'Incorrect password or email' }) 
        }
        if(user.googleId != null){ 
            return res.status(400).json({success: false, message:'Invalid Google login' });
        }
        const auth = await bcrypt.compare(password,user.password)
        if (!auth) {
            return res.status(404).json({success: false, message:'Incorrect password or email' }) 
        }
        if(!user.isVerify) {
            return res.status(403).json({success: false, message:'Please verify your email address first' })
        }
        const token = createSecretToken(user._id);
        res.cookie("token", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
            httpOnly: true, // Prevents XSS attacks
            secure: process.env.NODE_ENV === 'production', // HTTPS only in production
            sameSite: 'strict', // CSRF protection
        });
        
        // Return user data (excluding password)
        const userData = {
            _id: user._id,
            email: user.email,
            username: `${user.firstname} ${user.lastname}`, // Combine first and last name
            isVerified: user.isVerify,
            role: user.role
        };
        
        res.status(200).json({ 
            success: true, 
            message: "User logged in successfully", 
            user: userData 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({success: false, message: "Internal server error"});
    }
}

export const logout = async (req, res) => {
    try {
        res.clearCookie('token')
        res.status(200).json({ message: "User logged out successfully" });
    } catch (error) {
        res.status(500).json({success:false, message:"internal server error"})
        console.log(error)
    }
}

export const resetPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (user.resetOtpExpires && user.resetOtpExpires > Date.now()) {
            return res.status(400).json({ message: "An OTP has already been sent. Please check your email." });
        }

        const OTP = Math.floor(100000 + Math.random() * 900000).toString();
        user.resetOtp = OTP;
        user.resetOtpExpires = Date.now() + 10 * 60 * 1000; 
        
        // Create a temporary token for the reset flow (1 hour expiry)
        const resetToken = jwt.sign(
            { email: user.email, purpose: 'password-reset' },
            process.env.TOKEN_KEY,
            { expiresIn: '1h' }
        );
        
        const details = {
            from: process.env.SENDGRID_FROM,
            to: user.email,
            subject: "Reset Password OTP",
            html: generateOtpHtml(OTP),
        };
        await mail.sendMail(details);
        await user.save();
        res.status(200).json({ 
            message: "Reset password OTP successfully sent", 
            success: true,
            resetToken: resetToken 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export const verifyResetOtp = async (req, res) => {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    if(otp === undefined || otp === null || otp === ''){
        return res.status(400).json({ message: "OTP is required" });
    }
    if(user && user.resetOtp === otp) {
        // Create a new token for the new password step
        const newPasswordToken = jwt.sign(
            { email: user.email, purpose: 'new-password' },
            process.env.TOKEN_KEY,
            { expiresIn: '1h' }
        );
        
        res.status(200).json({ 
            message: "OTP verified successfully", 
            success: true,
            newPasswordToken: newPasswordToken 
        });
    } else {
        res.status(400).json({ message: "Invalid or expired OTP", success: false });
    }
}

export const updatePassword = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    user.password = password;
    user.resetOtp = undefined;
    user.resetOtpExpires = undefined;
     const details = {
        from: process.env.SENDGRID_FROM,
        to: user.email,
        subject: "Password Reset Confirmation",
        html: successMessage(),
    };
    await mail.sendMail(details);
    await user.save();
    res.status(200).json({ message: "Password updated successfully", success: true });
}

// Validate reset token for accessing OTP page
export const validateResetToken = async (req, res) => {
    const { token } = req.body;
    
    try {
        const decoded = jwt.verify(token, process.env.TOKEN_KEY);
        
        if (decoded.purpose !== 'password-reset') {
            return res.status(401).json({ 
                success: false, 
                message: "Invalid token purpose" 
            });
        }
        
        res.status(200).json({ 
            success: true, 
            email: decoded.email,
            message: "Token is valid" 
        });
    } catch (error) {
        res.status(401).json({ 
            success: false, 
            message: "Invalid or expired token" 
        });
    }
}

// Validate new password token for accessing new password page
export const validateNewPasswordToken = async (req, res) => {
    const { token } = req.body;
    
    try {
        const decoded = jwt.verify(token, process.env.TOKEN_KEY);
        
        if (decoded.purpose !== 'new-password') {
            return res.status(401).json({ 
                success: false, 
                message: "Invalid token purpose" 
            });
        }
        
        res.status(200).json({ 
            success: true, 
            email: decoded.email,
            message: "Token is valid" 
        });
    } catch (error) {
        res.status(401).json({ 
            success: false, 
            message: "Invalid or expired token" 
        });
    }
}
export const googleLogin = async ( req, res ) => {
    try {
        const token = createSecretToken(req.user._id);
        res.cookie("token", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
        });
        const redirectURL =
            process.env.NODE_ENV === "production"
                ? "https://soilsnap-production.up.railway.app/dashboard"
                : "http://localhost:5173/dashboard";

            res.redirect(redirectURL);
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}