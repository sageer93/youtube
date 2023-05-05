const multer = require("multer")

// const diskstorage = multer.diskStorage({
//     destination:(req,file,callback)=>{
//         callback(null,'public/videos')
//     },
//     filename:(req,file,callback)=>{
//         const imageName = `${new Date().toLocaleDateString()}-${new Date().now()}-${file.originalname}.mp4`
//         console.log(imageName)
//         callback(null,imageName)
//     }
// })


module.exports = multer({dest:"public/videos"}).single("video")