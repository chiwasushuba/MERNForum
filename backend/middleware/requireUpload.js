const multer = require('multer');
const path = require('path');

// Configure storage location & naming
const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, 'uploads/');
    },
    filename: function (req, file, callback) {
        const uniqueSuffix = Date.now() + path.extname(file.originalname);
        callback(null, uniqueSuffix);
    }
});

// File filter to allow only specific image types
const fileFilter = (req, file, callback) => {
    const allowedTypes = /\.(jpg|jpeg|png|gif)$/i;
    
    if (!file.originalname.match(allowedTypes)) {
        req.fileValidationError = 'Only image files (JPG, JPEG, PNG, GIF) are allowed!';
        return callback(null, false);
    }

    callback(null, true);
};

// Multer upload configuration
const upload = multer({
    storage: storage,
    // limits: { fileSize: 5 * 1024 * 1024 }, // Max file size: 5MB
    // fileFilter: fileFilter
});

module.exports = upload;
