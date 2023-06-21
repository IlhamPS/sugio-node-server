const express = require('express');

const { multer, authenticateGoogle, uploadToGoogleDrive, deleteFile } = require('../api/file/upload');

const router = express.Router();

router.post("/upload", multer.single("file"), async (req, res, next) => {
  try {
    console.log('upload!');
    if (!req.file) {
      res.status(400).send("No file uploaded.");
      return;
    }
    const auth = authenticateGoogle();
    const response = await uploadToGoogleDrive(req.file, auth);
    deleteFile(req.file.path);
    res.status(200).json({ response });
  } catch (err) {
    console.log(err);
    res.status(400).json({ err });
  }
});

module.exports = router