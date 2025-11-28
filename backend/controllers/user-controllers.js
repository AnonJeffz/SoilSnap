import User from "../models/user-model.js";
import mail from "../config/mail.js";
import crypto from "crypto";
import { encrypt} from "../util/Security.js";
import fs from "fs";
import path from "path";

const Details = (user) => {
  const ID = encrypt(user._id.toString());
  return {
    _id: user._id,
    address: user.address,
    createdAt: user.createdAt,
    email: user.email,
    firstname: user.firstname,
    isVerify: user.isVerify,
    lastname: user.lastname,
    middlename: user.middlename,
    phone: user.phone,
    postalcode: user.postalcode,
    role: user.role,
    updatedAt: user.updatedAt,
    verificationToken: user.verificationToken,
    profile: user.profile,
  }
}

export const getUser = async (req, res) => {
  try {
    res.status(200).json({ 
      success: true, 
      user: Details(req.user),
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Error fetching user", 
      error: error.message 
    });
  }
}

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password -verificationToken');
    const verifiedUsers = users.filter(user => user.isVerify === true);
    

    const sanitizedUsers = verifiedUsers.map(user => ({
      _id: user._id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      role: user.role,
      isVerify: user.isVerify,
      createdAt: user.createdAt,
      profile: user.profile
    }));
    
    res.status(200).json({ 
      success: true, 
      users: sanitizedUsers,
      message: "Users fetched successfully"
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Error fetching users", 
      error: error.message 
    });
  }
}

export const createUser = async (req, res) => {
  const user = req.body;

  const newUser = new User(user);
  const existingUser = await User.findOne({ email: newUser.email });

  try {
    if (existingUser) {
      return res.status(409).json({ 
        success: false, 
        message: "Email already exists", 
        error: "email" 
      });
    }
    const verificationToken = crypto.randomBytes(32).toString("hex");
    newUser.verificationToken = verificationToken;

    const verifyUrl = `https://soilsnap-production.up.railway.app/api/users/verify/${verificationToken}`;

    const details = {
      from: process.env.SENDGRID_FROM,
      to: newUser.email,
      subject: "Verify your email",
      html: `<div style="text-align:center;margin-top:40px;">
          <b>Welcome! Verify your email address to complete creating your account.</b><br>
          <a style="display:inline-block;padding:10px 20px;background:#2563eb;color:#fff;text-decoration:none;border-radius:6px;font-weight:bold;margin-top:8px;" href="${verifyUrl}">
            Click here to verify your email
          </a>
        </div>`,
    };
    await mail.sendMail(details);

    await newUser.save();
    res.status(201).json({ 
      success: true, 
      message: "User created successfully. Please check your email to verify your account.", 
      user: {
        _id: newUser._id,
        email: newUser.email,
        username: `${newUser.firstname} ${newUser.lastname}`,
        isVerified: newUser.isVerified
      }
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      message: "Error creating user", 
      error: error.message 
    });
  }
}

export const verifyUser = async (req, res) => {
  const { token } = req.params;
  try {
    const user = await User.findOne({ verificationToken: token });
    user.isVerify = true;
    user.verificationToken = undefined;
    await user.save();
    res.status(200).send(`
      <html>
        <head>
          <meta http-equiv="refresh" content="0;url=https://soilsnap-production.up.railway.app/signin" />
        </head>
        <body>
          <p>Verification successful! Redirecting to login page...</p>
        </body>
      </html>
    `);
  } catch (error) {
    res.status(500).json({ message: "Error verifying user", error: error.message });
  }
}

export const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error: error.message });
  }
}

// ...existing code...

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { firstname, middlename, lastname, email, role, phone, address, postalcode } = req.body;
  const image = req.file ? req.file.filename : null;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let imagePath = user.profile;
    if (image) {
      // Delete old image if it exists
      if (user.profile) {
        const oldImage = path.join(
            process.cwd(),
            "backend",
            user.profile.startsWith("/") ? user.profile.slice(1) : user.profile
        );
        if (fs.existsSync(oldImage)) {
          fs.unlinkSync(oldImage);
        }
      }
      imagePath = `/uploads/profile/${image}`;
    }
    
    user.firstname = firstname;
    user.middlename = middlename;
    user.lastname = lastname;
    user.role = role,
    user.email = email;
    user.phone = phone;
    user.address = address;
    user.postalcode = postalcode;
    user.profile = imagePath;

    await user.save();
    res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Error updating user", error: error.message });
  }  
}


export const getUserCount = async ( req, res ) => {
  try {
    const userCount = await User.countDocuments();
    res.status(200).json({ userCount });
  } catch (error) {
    res.status(500).json({ message: "Error fetching user count", error: error.message });
  }
}

export const getSoilExpertCount = async( req, res ) => {
  try {
    const count = await User.countDocuments({ role: 'Soil Expert' });
    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({ message: "Error fetching Soil Expert count", error: error.message });
  }
}