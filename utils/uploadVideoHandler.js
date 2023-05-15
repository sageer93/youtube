const multer = require("multer")
const cloudinary = require("./cloudinaryConfig")
const {CloudinaryStorage} = require("multer-storage-cloudinary")

const storage = new CloudinaryStorage({
    cloudinary:cloudinary,
    params:{
        folder:"videos",
        resource_type: 'video',
        format: async (req, file) => {
            return "mp4"
        },
        public_id: (req, file) => {
            const timestamp = Date.now();
            const userId = "video";
            return `${userId}-${timestamp}`;
        },
    },
})

module.exports = multer({storage:storage}).single("videos")