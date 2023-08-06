const express = require('express');
const path = require('path');
const url = require('url')
var fs = require('fs');

const { 
  multer, 
  // authenticateGoogle, 
  // uploadToGoogleDrive, 
  // deleteFile 
} = require('../api/file/upload');

const router = express.Router();

router.post("/upload", multer.single("file"), async (req, res, next) => {
  try {
    if (!req.file) {
      // res.status(400).send("No file uploaded.");
      res.send({
        status: false,
        msg: 'File Must Not Empty'
      })
      return;
    }
    res.send({
      status: true,
      msg: 'Upload Success',
      url: `documents/${req.file.filename}`
    })
    // const auth = authenticateGoogle();
    // const response = await uploadToGoogleDrive(req.file, auth);
    // deleteFile(req.file.path);
    // res.status(200).json({ status: true, msg: 'Upload Success' });
  } catch (err) {
    console.log(err);
    res.status(400).json({ err });
  }
});

module.exports = router