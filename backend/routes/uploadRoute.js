const express = require('express');
const router = express.Router();
const upload = require('../middleware/requireMulter');
const { uploadImage } = require('../controllers/uploadController');

router.post('/upload-image', upload.single('image'), uploadImage);

module.exports = router;
