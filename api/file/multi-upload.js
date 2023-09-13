const multer = require('multer');
const fs = require('fs');
const path = require('path');

const destination = path.join(__dirname, '../../public/documents')
// Configure multer storage and file name
const storage = multer({
  storage: multer.diskStorage({
    destination: function (req, file, callback) {
      callback(null, destination);
    },
    filename: function (req, file, callback) {
      callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
    },
  })
});

// Create multer upload instance
const upload = multer({ storage: storage });

// Custom file upload middleware
const multiUpload = (req, res, next) => {
  // Use multer upload instance
  upload.array('file', 5)(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    // Retrieve uploaded files
    const files = req.file;
    const errors = [];

    // Handle validation errors
    if (errors.length > 0) {
      // Remove uploaded files
      files.forEach((file) => {
        fs.unlinkSync(file.path);
      });

      return res.status(400).json({ errors });
    }

    // Attach files to the request object
    req.files = files;

    // Proceed to the next middleware or route handler
    next();
  });
};

module.exports = multiUpload;