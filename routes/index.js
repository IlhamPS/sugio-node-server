const express = require('express');
const multiUpload = require('../api/file/multi-upload');
const firestore = require('../firebase')

const { 
  multer, 
  authenticateGoogle, 
  uploadToGoogleDrive, 
  deleteFile 
} = require('../api/file/upload');

const router = express.Router();

const makeid = (length) => {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

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
    const auth = authenticateGoogle();
    const response = await uploadToGoogleDrive(req.file, auth);
    deleteFile(req.file.path);
    res.send({
      status: true,
      msg: 'Upload Success',
      url: `documents/${req.file.filename}`,
      response: response
    })
    // res.status(200).json({ status: true, msg: 'Upload Success' });
  } catch (err) {
    console.log(err);
    res.status(400).json({ err });
  }
});

router.post("/multi-upload/:data", multer.array("file", 10), async (req, res, next) => {
  try {
    const files = req.files;
    const { data } = req.params
    const paramsData = JSON.parse(data)
    console.log(paramsData)
    if (!files) {
      res.send({
        status: false,
        msg: 'File Must Not Empty'
      })
      return;
    }
    const auth = authenticateGoogle();
    for (let index = 0; index < files.length; index++) {
      const id = makeid(12)
      const docRef = paramsData.path.split("-").join("/")
      const response = await uploadToGoogleDrive(files[index], auth);
      const name = files[index].originalname
       const docData = {
        createAt: new Date(),
        file: {
          name: name,
          updateAt: new Date(),
          url: `https://drive.google.com/file/d/${response.data.id}/preview`,
        },
        title: name,
        uploader: paramsData.uploader,
        date: new Date(paramsData.date),
        type: 2,
        path: `${docRef}/${id}`
      }
      firestore.doc(`${docRef}/${id}`)
        .set(docData, { merge: true })
    }
    res.status(200).json({ message: 'File upload successful' });
  } catch (err) {
    console.log(err);
    res.status(400).json({ err });
  }
});

module.exports = router