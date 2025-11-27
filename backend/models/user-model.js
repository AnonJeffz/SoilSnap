import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  googleId: {
    type: String,
    required: false,
    unique: true,
  },
  firstname: {
    type: String,
    required: true,
  },
  middlename: {
    type: String,
    required: false, 
    default: "",
  },
  lastname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  roleVerify:{
    type: String,
  },
  address: {
    type: String,
    required: false,
  },
  phone: {
    type: String,
    required: false,
  },
  profile: {
    type: String,
    required: false
  },
  postalcode: {
    type: String,
    required: false
  },
  isVerify: {
    type: Boolean,
    default: false,
    required: false,
  },
  verificationToken: {
    type: String,
    required: false,
  },
  resetOtp: {
    type: String,
    required: false,
  },
  resetOtpExpires: {
    type: Date,
    required: false,
  },

}, {
  timestamps: true,
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next()
});

const User = mongoose.model("User", userSchema);

export default User;
