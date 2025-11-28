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
    roleVerify: user.roleVerify,
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

    const verifyUrl = `https://soilsnap-production.up.railway.app/verify/${verificationToken}`;

    const details = {
      from: process.env.SENDGRID_FROM,
      to: newUser.email,
      subject: "Verify your SOILSNAP account",
      html: `
      <div style="font-family: 'Segoe UI', Roboto, sans-serif; background-color: #f0fdf4; padding: 40px 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); overflow: hidden;">
          
          <!-- Header -->
          <div style="background-color: #22c55e; padding: 20px; text-align: center;">
            <h1 style="color: #fff; font-size: 28px; margin: 0;">SOILSNAP</h1>
          </div>
          
          <!-- Body -->
          <div style="padding: 30px; text-align: center;">
            <h2 style="color: #166534; font-size: 22px; margin-bottom: 16px;">Welcome to SOILSNAP!</h2>
            <p style="color: #4b5563; font-size: 16px; margin-bottom: 30px;">
              Verify your email address to complete your account setup and start exploring SoilSnap.
            </p>

            <!-- Button -->
            <a href="${verifyUrl}" style="
              display: inline-block;
              padding: 12px 25px;
              background-color: #22c55e;
              color: #ffffff;
              text-decoration: none;
              border-radius: 8px;
              font-weight: 600;
              font-size: 16px;
              box-shadow: 0 4px 6px rgba(0,0,0,0.1);
              transition: all 0.2s ease-in-out;
            " onmouseover="this.style.backgroundColor='#16a34a'" onmouseout="this.style.backgroundColor='#22c55e'">
              Verify My Account
            </a>

            <p style="margin-top: 25px; color: #6b7280; font-size: 14px;">
              If you did not create a SoilSnap account, you can safely ignore this email.
            </p>
          </div>

          <!-- Footer -->
          <div style="background-color: #f0fdf4; padding: 15px; text-align: center; color: #4b5563; font-size: 12px;">
            &copy; ${new Date().getFullYear()} SOILSNAP. All rights reserved.
          </div>
        </div>
      </div>
      `,
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
        if (!token) {
            return res.status(400).json({ success: false, message: "Invalid verification link" });
        }

        const user = await User.findOne({ verificationToken: token });

        if (!user) {
            return res.status(404).json({ success: false, message: "Token invalid or expired" });
        }

        user.isVerify = true;
        user.verificationToken = undefined;
        await user.save();

        return res.status(200).json({ success: true, message: "Account verified" });

    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error" });
    }
};



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
    const count = await User.countDocuments({ role: 'Soil Expert', roleVerify: 'true' });
    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({ message: "Error fetching Soil Expert count", error: error.message });
  }
}