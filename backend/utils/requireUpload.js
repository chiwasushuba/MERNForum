const multer = require('multer');
const path = require('path');

// Wala na 
const storage = multer.memoryStorage();

// File filter to allow only specific image types no videos allowed baka di kayanin ng cloud storage ko
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
    limits: { fileSize: 5 * 1024 * 1024 }, // Max file size 5MB just replace 5 on how many mb you want 
    fileFilter: fileFilter
});

module.exports = upload;
