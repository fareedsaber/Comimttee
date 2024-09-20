const express = require('express');
const router = express.Router();
const Client = require('../module/Client'); // Adjust the path if necessary
const { cloudinary, storage } = require('../config/Cloudinary');
const multer = require('multer');
const upload = multer({ storage });

router.post('/', upload.single('photo'), async (req, res, next) => {
  try {
    console.log(req.body); // Log incoming data
    console.log(req.file); // Log uploaded file

    const clientData = req.body;
    if (req.file) {
      clientData.photo = req.file.path; // Cloudinary URL
    }

    const client = new Client(clientData);
    await client.save();
    res.status(201).json(client);
  } catch (error) {
    console.error(error); // Log the error
    next(error); // Pass the error to the global error handler
  }
});



// Update a client and upload a new photo
router.put('/:id', upload.single('photo'), async (req, res) => {
  try {
    const clientData = req.body;
    
    // If there's a new file (photo), update the Cloudinary URL
    if (req.file) {
      clientData.photo = req.file.path; // Cloudinary URL
    }

    const client = await Client.findByIdAndUpdate(req.params.id, clientData, { new: true });
    
    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }

    // Regenerate the QR code after updating client information
    await client.generateQRCode();

    res.status(200).json(client);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
