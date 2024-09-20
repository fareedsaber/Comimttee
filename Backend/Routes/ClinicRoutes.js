const express = require("express");
const router = express.Router();
const Clinic = require("../module/Clinic"); // Adjust the path to the model accordingly

// Route to create a new clinic
router.post("/add", async (req, res) => {
    try {
        const { name, centerId } = req.body; // Receive centerId from the request body
        const newClinic = new Clinic({ name, center: centerId });
        await newClinic.save();
        res.status(201).json({ message: "Clinic created successfully", clinic: newClinic });
    } catch (error) {
        res.status(500).json({ message: "Error creating clinic", error: error.message });
    }
});


// Route to get all clinics
router.get("/", async (req, res) => {
    try {
        const clinics = await Clinic.find();
        res.status(200).json(clinics);
    } catch (error) {
        res.status(500).json({ message: "Error fetching clinics", error: error.message });
    }
});

// Route to update a clinic by ID
router.put("/:id", async (req, res) => {
    try {
        const { name } = req.body;
        const updatedClinic = await Clinic.findByIdAndUpdate(req.params.id, { name }, { new: true });
        if (!updatedClinic) {
            return res.status(404).json({ message: "Clinic not found" });
        }
        res.status(200).json({ message: "Clinic updated successfully", clinic: updatedClinic });
    } catch (error) {
        res.status(500).json({ message: "Error updating clinic", error: error.message });
    }
});


router.delete("/:id", async (req, res) => {
    try {
        const deletedClinic = await Clinic.findByIdAndDelete(req.params.id);
        if (!deletedClinic) {
            return res.status(404).json({ message: "Clinic not found" });
        }
        res.status(200).json({ message: "Clinic deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting clinic", error: error.message });
    }
});

module.exports = router;
