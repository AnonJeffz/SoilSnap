import mongoose from "mongoose";

const requestSchema = new mongoose.Schema({ 
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
    image: {
        type: String,
        required: true
    },
    originalFilename: {
        type: String,
        required: false
    },
    description: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
}, {
  timestamps: true,
});

const Request = mongoose.model("UpgradeRequest", requestSchema);
export default Request;