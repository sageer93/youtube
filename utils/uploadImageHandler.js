const multer = require("multer")

// const diskstorage = multer.diskStorage({
//     destination:(req,file,callback)=>{
//         callback(null,'public/videos')
//     },
//     filename2:(req,file,callback)=>{
//         const imageName = `${new Date().toLocaleDateString()}-${new Date().now()}-${file.originalname}.mp4`
//         console.log(imageName)
//         callback(null,imageName)
//     }
// })

const filter = (req,file,cb)=>{
    if(file.mimetype==="image/png"||file.mimetype==="image/jpeg"||file.mimetype==="image/jpg"||file.mimetype==="image/tiff"){
        return cb(null,true)
    }
}
module.exports = multer({dest:"public/images",fileFilter:filter}).single("image")