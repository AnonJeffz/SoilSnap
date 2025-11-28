import fs from "fs";
import path from "path";
import Location from "../models/location-model.js";
import { createLog } from './logs-controllers.js';

export const createLocation = async (req, res) => {
    const { soil_classification, latitude, longitude,imageSource  } = req.body;
    const image = req.file ? req.file.filename : null;

    try {
        const newLocation = new Location({ soil_classification, latitude, longitude, image : `/uploads/location/${image}`, imageSource });
        await newLocation.save();
        res.status(201).json({message: "Location created successfully", location: newLocation });
    } catch (error) {
        res.status(500).json({ error: "Failed to create location" });
    }
};

export const getAllLocation = async (req, res) => {
    try {
        const locations = await Location.find();
        res.status(200).json(locations);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch locations" });
    }
};


export const deleteLocation = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedLocation = await Location.findById(id);
        if (!deletedLocation) {
            return res.status(404).json({ error: "Location not found" });
        }
        let imagePath = deletedLocation.image;
        const oldImagePath = path.join(
            process.cwd(),
            "backend",
            imagePath.startsWith("/") ? imagePath.slice(1) : imagePath
        );
        if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
        }
        await Location.findByIdAndDelete(deletedLocation._id);
        await createLog({
            user_id: req.user?._id, 
            action: "DELETE",
            table: "Location",
            description: `User ${req.user?.email || "Guest"} deleted a location.`,
            status: "success",
            ipAddress: req.ip,
            userAgent: req.headers["user-agent"],
        });
        res.status(200).json({ message: "Location deleted successfully" });
    } catch (error) {
        await createLog({
            user_id: req.user?._id, 
            action: "DELETE",
            table: "Location",
            description: `User ${req.user?.email || "Guest"} deleted a location.`,
            status: "error",
            ipAddress: req.ip,
            userAgent: req.headers["user-agent"],
        });
        res.status(500).json({ error: "Failed to delete location" });
    }
};

export const updateLocation = async (req, res) => {
    const { id } = req.params;
    const { latitude, longitude } = req.body;

    try {
        const updatedLocation = await Location.findById(id);
        
        if (!updatedLocation) {
            return res.status(404).json({ error: "Location not found" });
        }
        updatedLocation.latitude = latitude;
        updatedLocation.longitude = longitude;
        await updatedLocation.save();
        await createLog({
            user_id: req.user?._id, 
            action: "UPDATE",
            table: "Location",
            description: `User ${req.user?.email || "Guest"} updated a location.`,
            status: "success",
            ipAddress: req.ip,
            userAgent: req.headers["user-agent"],
        });
        res.status(200).json({ message: "Location updated successfully", location: updatedLocation });
    } catch (error) {
        await createLog({
            user_id: req.user?._id, 
            action: "UPDATE",
            table: "Location",
            description: `User ${req.user?.email || "Guest"} updated a location.`,
            status: "error",
            ipAddress: req.ip,
            userAgent: req.headers["user-agent"],
        });
        res.status(500).json({ error: "Failed to update location" });
    }
}