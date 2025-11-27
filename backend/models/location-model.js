import mongoose  from "mongoose";

const soilLocationSchema = new mongoose.Schema({ 
    soil_classification: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    latitude: {
        type: String,
        required: true
    },
    longitude: {
        type: String,
        required: true
    },
    number: {
        type: String,
        required: false
    },
    action: {
         type: String,
    }
}, {
  timestamps: true,
});
soilLocationSchema.pre("save", async function (next) {
    if (!this.number) {
        const count = await mongoose.model("Soil_Location").countDocuments();
        // Always pad to at least 3 digits, but allow more if needed (e.g., 0001, 0002, ... after 999)
        const nextNum = count + 1;
        // If nextNum is 1000 or more, pad to 4 digits, etc.
        const padLength = Math.max(3, String(nextNum).length);
        this.number = String(nextNum).padStart(padLength, "0");
    }
    next();
});
const SoilClassification = mongoose.model("Soil_Location", soilLocationSchema);
export default SoilClassification;