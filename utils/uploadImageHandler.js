const multer = require("multer")
const cloudinary = require("./cloudinaryConfig")
const {CloudinaryStorage } = require("multer-storage-cloudinary")
const storage = new CloudinaryStorage({
    cloudinary:cloudinary,
    params:{
        folder:"images",
        format: async (req, file) => 'png',
        public_id: (req, file) => {
            const timestamp = Date.now();
            const userId = req.user && req.user._id ? req.user._id : "avatar";
            return `${userId}-${timestamp}`;
        },
    }
})

module.exports = multer({storage:storage}).single("image")