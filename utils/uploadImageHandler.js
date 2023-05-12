const multer = require("multer")

const filter = (req, file, cb) => {
    if (file.mimetype === "image/png" || file.mimetype === "image/jpeg" || file.mimetype === "image/jpg" || file.mimetype === "image/tiff") {
        return cb(null, true)
    }
}
module.exports = multer({ dest: "public/images", fileFilter: filter }).single("image")