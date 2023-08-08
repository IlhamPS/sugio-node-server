const { google } = require('googleapis');
const Multer = require('multer')
const fs = require('fs')
const path = require('path')

const destination = path.join(__dirname, '../../public/documents')

const multer = Multer({
  storage: Multer.diskStorage({
    destination: function (req, file, callback) {
      callback(null, destination);
    },
    filename: function (req, file, callback) {
      callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
    },
  })
});

const authenticateGoogle = () => {
  const auth = new google.auth.GoogleAuth({
    keyFile: `${__dirname}/service-account-key-file.json`,
    scopes: "https://www.googleapis.com/auth/drive",
  });
  return auth;
};

const uploadToGoogleDrive = async (file, auth) => {
  try {
    const fileMetadata = {
      name: file.originalname,
      parents: ["17lBRt7K3wlOwjqDsijp6yWZv4M-Qin45"], // Change it according to your desired parent folder id
      //? SUGIO parent = 17lBRt7K3wlOwjqDsijp6yWZv4M-Qin45
    };
    const media = {
      mimeType: file.mimetype,
      body: fs.createReadStream(file.path),
    };
    const driveService = google.drive({ version: "v3", auth });
    const response = await driveService.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: "id",
    });
    return response;
  } catch (err) {
    console.log(err)
    return err
  }
};

const deleteFile = (filePath) => {
  fs.unlink(filePath, () => {
    console.log("file deleted");
  });
};

module.exports = {
  multer,
  authenticateGoogle,
  uploadToGoogleDrive,
  deleteFile,
}