import User from "../models/user-model.js";
import mail from "../config/mail.js";
import crypto from "crypto";
import { encrypt } from "../util/Security.js";
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
    
    console.log('✅ User created successfully:', newUser.email);
    console.log('🔗 Verification URL:', verifyUrl);
    
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
    console.error('❌ Error creating user:', error);
    res.status(400).json({ 
      success: false, 
      message: "Error creating user", 
      error: error.message 
    });
  }
}

export const verifyUser = async (req, res) => {
  const { token } = req.params;
  
  console.log('\n=== EMAIL VERIFICATION ATTEMPT ===');
  console.log('📧 Token received:', token);
  console.log('🕒 Timestamp:', new Date().toISOString());
  
  try {
    const user = await User.findOne({ verificationToken: token });
    
    if (!user) {
      console.log('❌ No user found with this token');
      
      // Set headers to prevent React from interfering
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('X-Content-Type-Options', 'nosniff');
      
      const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="robots" content="noindex">
  <title>Invalid Link</title>
  <style>
    /* Reset to prevent any inherited styles */
    html, body { margin: 0; padding: 0; height: 100%; }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }
    .container {
      text-align: center;
      background: white;
      padding: 40px;
      border-radius: 16px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.2);
      max-width: 500px;
      animation: slideIn 0.5s ease-out;
    }
    @keyframes slideIn {
      from { opacity: 0; transform: translateY(-20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .icon {
      font-size: 64px;
      margin-bottom: 20px;
    }
    h1 {
      color: #e74c3c;
      margin-bottom: 20px;
      font-size: 24px;
      font-weight: 600;
    }
    p {
      color: #666;
      line-height: 1.6;
      margin-bottom: 15px;
      font-size: 16px;
    }
    a {
      display: inline-block;
      margin-top: 20px;
      padding: 12px 24px;
      background: #2563eb;
      color: white;
      text-decoration: none;
      border-radius: 8px;
      font-weight: bold;
      transition: all 0.3s ease;
    }
    a:hover {
      background: #1d4ed8;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(37, 99, 235, 0.4);
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="icon">❌</div>
    <h1>Invalid Verification Link</h1>
    <p>This verification link is invalid or has already been used.</p>
    <p>If you need to verify your email, please register again or contact support.</p>
    <a href="https://soilsnap-production.up.railway.app/signup">Register Again</a>
  </div>
</body>
</html>`;
      
      return res.status(404).send(html);
    }
    
    console.log('✅ User found:', user.email);
    
    user.isVerify = true;
    user.verificationToken = undefined;
    await user.save();
    
    console.log('✅ User verified successfully:', user.email);
    console.log('=================================\n');
    
    // Set headers to prevent React from interfering
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="refresh" content="3;url=https://soilsnap-production.up.railway.app/signin?verified=true">
  <meta name="robots" content="noindex">
  <title>Email Verified</title>
  <style>
    /* Reset to prevent any inherited styles */
    html, body { margin: 0; padding: 0; height: 100%; }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }
    .container {
      text-align: center;
      background: white;
      padding: 40px;
      border-radius: 16px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.2);
      max-width: 500px;
      animation: slideIn 0.5s ease-out;
    }
    @keyframes slideIn {
      from { opacity: 0; transform: translateY(-20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .icon {
      font-size: 64px;
      margin-bottom: 20px;
      animation: bounce 1s ease infinite;
    }
    @keyframes bounce {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.1); }
    }
    h1 {
      color: #27ae60;
      margin-bottom: 20px;
      font-size: 24px;
      font-weight: 600;
    }
    p {
      color: #666;
      line-height: 1.6;
      margin-bottom: 10px;
      font-size: 16px;
    }
    .spinner {
      margin: 20px auto;
      width: 40px;
      height: 40px;
      border: 4px solid #f3f3f3;
      border-top: 4px solid #2563eb;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    .progress-bar {
      width: 100%;
      height: 4px;
      background: #f3f3f3;
      border-radius: 2px;
      margin-top: 20px;
      overflow: hidden;
    }
    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #667eea, #764ba2);
      animation: progress 3s linear;
    }
    @keyframes progress {
      from { width: 0%; }
      to { width: 100%; }
    }
    #countdown {
      font-weight: bold;
      color: #2563eb;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="icon">✓</div>
    <h1>Email Verified Successfully!</h1>
    <p>Your email has been verified. You can now log in to your account.</p>
    <p style="font-size: 14px; color: #999;">
      Redirecting to login page in <span id="countdown">3</span> seconds...
    </p>
    <div class="spinner"></div>
    <div class="progress-bar">
      <div class="progress-fill"></div>
    </div>
  </div>
  <script>
    let seconds = 3;
    const countdown = document.getElementById('countdown');
    const interval = setInterval(() => {
      seconds--;
      countdown.textContent = seconds;
      if (seconds <= 0) {
        clearInterval(interval);
      }
    }, 1000);
  </script>
</body>
</html>`;
    
    return res.status(200).send(html);
    
  } catch (error) {
    console.error('❌ Verification error:', error);
    console.log('=================================\n');
    
    // Set headers to prevent React from interfering
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="robots" content="noindex">
  <title>Error</title>
  <style>
    /* Reset to prevent any inherited styles */
    html, body { margin: 0; padding: 0; height: 100%; }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }
    .container {
      text-align: center;
      background: white;
      padding: 40px;
      border-radius: 16px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.2);
      max-width: 500px;
    }
    .icon { 
      font-size: 64px; 
      margin-bottom: 20px; 
    }
    h1 { 
      color: #e74c3c; 
      font-size: 24px; 
      margin-bottom: 20px;
      font-weight: 600;
    }
    p { 
      color: #666; 
      line-height: 1.6; 
      margin-bottom: 15px;
      font-size: 16px;
    }
    .error {
      background: #fee;
      padding: 10px;
      border-radius: 4px;
      margin-top: 15px;
      font-size: 12px;
      color: #c33;
      word-break: break-word;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="icon">⚠️</div>
    <h1>Verification Error</h1>
    <p>An error occurred while verifying your email. Please try again or contact support.</p>
    <div class="error">${error.message}</div>
  </div>
</body>
</html>`;
    
    return res.status(500).send(html);
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
    user.role = role;
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

export const getUserCount = async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    res.status(200).json({ userCount });
  } catch (error) {
    res.status(500).json({ message: "Error fetching user count", error: error.message });
  }
}

export const getSoilExpertCount = async (req, res) => {
  try {
    const count = await User.countDocuments({ role: 'Soil Expert' });
    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({ message: "Error fetching Soil Expert count", error: error.message });
  }
}
