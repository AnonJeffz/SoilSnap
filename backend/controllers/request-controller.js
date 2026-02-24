import Request from "../models/upgade-request-model.js"
import User from "../models/user-model.js";
import path from "path";
import fs from "fs";
import { createLog } from './logs-controllers.js';
import mail from "../config/mail.js";

export const createRequest = async(req, res) => {
    try{
        const { firstname, middlename, lastname, email, description, type } = req.body;
        const image = req.file ? req.file.filename : null;
        const originalFilename = req.file ? req.file.originalname : null;

        const existingRequest = await Request.findOne({ 
            email: email,
        });

        if(existingRequest){
            if (existingRequest.status === "Request") {

                if (image) {
                    const uploadedFilePath = path.join(process.cwd(), "backend", "uploads", "request", image);
                    if (fs.existsSync(uploadedFilePath)) {
                        fs.unlinkSync(uploadedFilePath);
                    }
                }

                return res.status(409).json({ 
                    success: false,
                    message: "A request with this email is already pending", 
                    error: "email" 
                });
            }
        }

        const newRequest = new Request({
            firstname,
            middlename,
            lastname,
            email,
            image: `/uploads/request/${image}`,
            originalFilename,
            description,
            type,
            status: "Request",
        });
        const result = await newRequest.save();
        await createLog({
            user_id: req.user?._id,
            action: "CREATE",
            table: "Request",
            description: `User ${req.user?.email || "Guest"} created a new request.`,
            status: "success",
            ipAddress: req.ip,
            userAgent: req.headers["user-agent"],
        });
        const details = {
            from: process.env.SENDGRID_FROM,
            to: req.user?.email,
            subject: "Verification Submitted Successfully",
            html: `
                <div style="font-family: 'Arial', sans-serif; color: #333; padding: 30px; text-align: center; background-color: #f9fafb; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #2b6cb0; font-size: 24px; font-weight: 600; margin-bottom: 20px;">Thank You for Your Submission!</h2>
                    <p style="font-size: 16px; line-height: 1.5; margin-bottom: 20px;">We’ve received your verification request for the Soil Expert program. Our team will review your submission and notify you once it's approved.</p>
                    <p style="font-size: 16px; line-height: 1.5; margin-bottom: 30px;">Please keep an eye on your inbox for further updates.</p>
                </div>
            `,
            };

        await mail.sendMail(details);
        res.status(201).json({ message: "Request created successfully", data: result });
    }
    catch(error){
        await createLog({
            user_id: req.user?._id,
            action: "CREATE",
            table: "Request",
            description: `User ${req.user?.email || "Guest"} created a new request.`,
            status: "error",
            ipAddress: req.ip,
            userAgent: req.headers["user-agent"],
        });
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

export const getAllRequests = async(req, res) => {
    try {
        const requests = await Request.find();
        res.status(200).json({ success: true, requests });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching requests", error: error.message });
    }
}

export const removeRequest = async(req, res) => {
    try {
        const { id } = req.params;
        const deletedRequest = await Request.findById(id);
        if (!deletedRequest) {
            return res.status(404).json({ success: false, message: "Request not found" });
        }

        let imagePath = deletedRequest.image;
        const oldImagePath = path.join(
            process.cwd(),
            "backend",
            imagePath.startsWith("/") ? imagePath.slice(1) : imagePath
        );
        if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
        }

        await Request.findByIdAndDelete(deletedRequest._id);
         await createLog({
            user_id: req.user?._id,
            action: "DELETE",
            table: "Request",
            description: `User ${req.user?.email || "Guest"} deleted a request.`,
            status: "success",
            ipAddress: req.ip,
            userAgent: req.headers["user-agent"],
        });
        res.status(200).json({ success: true, message: "Request removed successfully" });
    } catch (error) {
         await createLog({
            user_id: req.user?._id,
            action: "CREATE",
            table: "Request",
            description: `User ${req.user?.email || "Guest"} created a new request.`,
            status: "error",
            ipAddress: req.ip,
            userAgent: req.headers["user-agent"],
        });
        res.status(500).json({ success: false, message: "Error removing request", error: error.message });
    }
}
export const viewRequest = async(req, res) => {
    try{
        const { id } = req.params
        const request = await Request.findById(id);
        if (!request) {
            return res.status(404).json({ success: false, message: "Request not found" });
        }
        res.status(200).json({ success: true, request });
    }
    catch(error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

export const editRequest = async(req, res) => {
    try {
        const { status } = req.body;
        const { id } = req.params;
        const request = await Request.findById(id);
        if (!request) {
            return res.status(404).json({ success: false, message: "Request not found" });
        }

        request.status = status;
        // add a message in gmail that decline and also in account notification
        const result = await request.save();
        res.status(200).json({ success: true, data: result });
    }
    catch(error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

export const changeRole = async(req, res) => {
    try {
        const { id } = req.params;

        const request = await Request.findById(id);
        const user = await User.findOne({ email: request.email });

        if (user) {
            user.role = "Soil Expert";
            user.roleVerify = "true";
            await user.save();
             await createLog({
                user_id: req.user?._id,
                action: "UPDATE",
                table: "Request",
                description: `User ${req.user?.email || "Guest"} become a Soil Expert.`,
                status: "success",
                ipAddress: req.ip,
                userAgent: req.headers["user-agent"],
            });

            const details = {
                from: process.env.SENDGRID_FROM,
                to: request.email,
                subject: "Verification Approved Successfully",
                html: `
                    <div style="font-family: 'Arial', sans-serif; color: #333; padding: 30px; text-align: center; background-color: #f9fafb; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #2b6cb0; font-size: 24px; font-weight: 600; margin-bottom: 20px;">Congratulations! Your Verification Has Been Approved!</h2>
                        <p style="font-size: 16px; line-height: 1.5; margin-bottom: 20px;">We're excited to inform you that your verification request for the Soil Expert program has been successfully approved. Welcome aboard!</p>
                        <p style="font-size: 16px; line-height: 1.5; margin-bottom: 30px;">You can now access the full features of the program. Feel free to reach out if you have any questions or need assistance.</p>
                    </div>
                `,
            };

            await mail.sendMail(details);

            res.status(200).json({ success: true, message: "User role updated to Soil Expert" });
        }
    } catch (error) {
         await createLog({
            user_id: req.user?._id,
            action: "UPDATE",
            table: "Request",
            description: `User ${req.user?.email || "Guest"} updated a request.`,
            status: "success",
            ipAddress: req.ip,
            userAgent: req.headers["user-agent"],
        });
        res.status(500).json({message: "Server error", error: error.message});
    }
}