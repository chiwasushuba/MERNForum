const uploadImage = (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }
  
    res.json({ imageUrl: `/uploads/${req.file.filename}` });
};
  
  module.exports = { uploadImage };
  