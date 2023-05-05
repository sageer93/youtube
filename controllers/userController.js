const User = require("../models/user")
const Video = require("../models/post");
const Comment = require("../models/comment")
const Notification = require("../models/notifications")
const fs = require("fs")
const History = require("../models/history")

const addNotification = async(user,video,title,message)=>{
    try {
        const OwnerNotification = await Notification({
            name:user.name,
            email:user.email,
            video:video,
            message:message,
            title:title
        })
        await OwnerNotification.save();
        return OwnerNotification._id
    } catch (error) {
        return res.status(400).json({success:false,message:error})
    }
}
/////////////////////////////////////////////user create////////////////////////////////////////////////////////
exports.SignUp = async (req, res, next) => {
    try {
        const { password, name, email, confirmPassword } = req.body;
        let image;
        if (req.file) {
            image = req.file.path;
        }
        if (!email || !password || !name) return res.status(500).json({success:false,message:"all field are required"})
        let user = await User.findOne({ email: email })
        if (user) return res.status(404).json({success:false,message:"Email already Axist"})
        user = await User({
            confirmPassword,
            email,
            name,
            password,
            image
        })
        const token = await user.ganerateToken(user._id)
        if (!token) return next(new ErrorHandler("Token is invalid", 500))
        await user.save()
        res.cookie("token", token).status(201).json({ success: true, message: "sign up success fully", token })
    } catch (error) {
        res.status(404).json({ success: false, message: error.message })
    }
}
/////////////////////////////////////////////user create////////////////////////////////////////////////////////

/////////////////////////////////////////////user login////////////////////////////////////////////////////////
exports.Login = async (req, res, next) => {
    try {
        const { password, email, confirmPassword } = req.body;

        if (!email || !confirmPassword || !password )return res.status(500).json({success:false,message:"all field are required"})
        let user = await User.findOne({ email: email })
        if (!user) return res.status(500).json({success:false,message:"Email not exist Sign up first"})
        const comparePassword = await user.comparePassword(password)
        if (!comparePassword) return res.status(500).json({success:false,message:"password not match"})
        const token = await user.ganerateToken(user._id)
        if (!token) return res.status(500).json({success:false,message:"token is not valid"})
        res.cookie("token", token).status(201).json({ success: true, message: "sign in success fully", token })
    } catch (error) {
        res.status(404).json({ success: false, message: error.message })
    }
}
/////////////////////////////////////////////user login////////////////////////////////////////////////////////

///////////////////////////////////////////// add video ////////////////////////////////////////////////////////
exports.uploadvideo = async(req,res)=>{
    try {
        const {title} = req.body;
        let video;
        if(req.file){
            video = req.file.path;
        }
        
        const loginUser =await User.findById(req.user._id)
        if(!loginUser) return res.status(500).json({success:false,message:"user not found"})
        const Addvideo = await Video({
            title,
            video,
            OwenerProfile:loginUser.image,
            OwnerId:loginUser._id,

        })
        await Addvideo.save()
        await loginUser.post.push(Addvideo._id)
        await loginUser.save()
        res.status(201).json({success:true,message:"Video uploaded"})
    } catch (error) {
        res.status(400).json({success:false,message:error})
    }
}
///////////////////////////////////////////// add video ////////////////////////////////////////////////////////


///////////////////////////////////////////// show videos ////////////////////////////////////////////////////////
exports.ShowVideos = async (req, res, next) => {
    try {
        
        const user = await User.findById(req.user._id)
        if(!user) return res.status(404).json({success:false,message:"user not found"})
        const show = await Video.find({_id:{$nin:user.post}})
        if(!show) return res.status(500).json({success:false,message:"videos not found"})
        res.status(201).json({ success: true, show})
    } catch (error) {
        res.status(404).json({ success: false, message: error.message })
    }
}
///////////////////////////////////////////// show videos ////////////////////////////////////////////////////////

///////////////////////////////////////////// my videos ////////////////////////////////////////////////////////
exports.MyVideos = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id)
        if(!user) return res.status(404).json({success:false,message:"user not found"})
        const show = await Video.find({_id:user.post})
        if(!show) return res.status(500).json({success:false,message:"videos not found"})
        res.status(201).json({ success: true, show,user})
    } catch (error) {
        res.status(404).json({ success: false, message: error.message })
    }
}
///////////////////////////////////////////// my videos ////////////////////////////////////////////////////////

///////////////////////////////////////////// save to watch Later ////////////////////////////////////////////////////////
exports.watchLater = async (req, res, next) => {
    try {
        const {id} = req.body;
        const user = await User.findById(req.user._id)
        if(!user) return res.status(404).json({success:false,message:"user not found"})
        const axist =user.watchLater.filter((elm)=>{
            return JSON.stringify(elm._id) === `"${id}"`
        })
        
        if(axist.length ===0){
            await user.watchLater.push(id)
            await user.save()
            return res.status(201).json({success:true,message:"saved"})
        }
        res.status(201).json({ success: true, message:"already saved"})
    } catch (error) {
        res.status(404).json({ success: false, message: error.message })
    }
}
///////////////////////////////////////////// save to watch Later ////////////////////////////////////////////////////////

///////////////////////////////////////////// show save to watch Later ////////////////////////////////////////////////////////
exports.savewatchLater = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id)
        if(!user) return res.status(404).json({success:false,message:"user not found"})
        const showSaveWatchLater = await Video.find({_id:user.watchLater})
        res.status(201).json({ success: true, showSaveWatchLater})
    } catch (error) {
        res.status(404).json({ success: false, message: error.message })
    }
}
///////////////////////////////////////////// show save to watch Later ////////////////////////////////////////////////////////

///////////////////////////////////////////// get subcriptions ////////////////////////////////////////////////////////
exports.getSubcriptions = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id)
        if(!user) return res.status(404).json({success:false,message:"user not found"})
        const subcriptions = await User.find({"subcriber":user._id})
        res.status(201).json({ success: true, subcriptions})
    } catch (error) {
        res.status(404).json({ success: false, message: error.message })
    }
}
///////////////////////////////////////////// get subcriptions ////////////////////////////////////////////////////////

///////////////////////////////////////////// like video ////////////////////////////////////////////////////////
exports.likeVideo = async (req, res, next) => {
    try {
        const {id} = req.body;
        const user = await User.findById(req.user._id)
        if(!user) return res.status(404).json({success:false,message:"user not found"})
        const likeVideo = await Video.findById(id)
        const ownerVideo = await User.findById(likeVideo.OwnerId)
        if(!ownerVideo || !likeVideo) return res.status(400).json({success:false,message:"video not found!"})
        const axist =user.likesVideos.filter((elm)=>{
            return JSON.stringify(elm._id) === `"${id}"`
        })
        if(axist.length ===0){
            const axistunlike =likeVideo.unlike.filter((elm)=>{
                return JSON.stringify(elm._id) === JSON.stringify(user._id)

            })
            if(axistunlike !== 0){
                await Video.findOneAndUpdate(likeVideo._id, { $pull: { unlike: user._id } }, { new: true });
            }
            await likeVideo.like.push(user._id)
            await likeVideo.save()
            await user.likesVideos.push(id)
            await user.save()
            const OwnerNotification = await addNotification(user,likeVideo.video,likeVideo.title,"Like Your Video")
            await ownerVideo.notivication.push(OwnerNotification)
            await ownerVideo.save()
            return res.status(201).json({success:true,message:"liked",like:true})
        }
        await Video.findOneAndUpdate(likeVideo._id, { $pull: { like: user._id } }, { new: true });
       await User.findOneAndUpdate(user._id, { $pull: { likesVideos: id } }, { new: true });
       const OwnerNotification = await addNotification(user,likeVideo.video,likeVideo.title,"Remove Like Your Video")
       await ownerVideo.notivication.push(OwnerNotification)
       await ownerVideo.save()
        res.status(201).json({ success: true,message:"remove like",like:false})
    } catch (error) {
        res.status(404).json({ success: false, message: error.message })
    }
}
///////////////////////////////////////////// like video ////////////////////////////////////////////////////////

///////////////////////////////////////////// unlike video ////////////////////////////////////////////////////////
exports.unlikeVideo = async (req, res, next) => {
    try {
        const {id} = req.body;
        const user = await User.findById(req.user._id)
        if(!user) return res.status(404).json({success:false,message:"user not found"})
        const likeVideo = await Video.findById(id)
        const ownerVideo = await User.findById(likeVideo.OwnerId)
        if(!ownerVideo || !likeVideo) return res.status(400).json({success:false,message:"video not found!"})
        const axistUnlike =likeVideo.unlike.filter((elm)=>{
            return JSON.stringify(elm._id) === JSON.stringify(user._id)
        })
        if(axistUnlike.length ===0){
            const axistlike =likeVideo.like.filter((elm)=>{
                return JSON.stringify(elm._id) === JSON.stringify(user._id)
            })
            if(axistlike !== 0){
                await Video.findOneAndUpdate(likeVideo._id, { $pull: { like: user._id } }, { new: true });
                await User.findOneAndUpdate(user._id, { $pull: { likesVideos: likeVideo._id } }, { new: true });
            }
            await likeVideo.unlike.push(user._id)
            await likeVideo.save()
            const OwnerNotification = await addNotification(user,likeVideo.video,likeVideo.title,"Unlike Your Video")
            await ownerVideo.notivication.push(OwnerNotification)
            await ownerVideo.save()
            return res.status(200).json({success:true,message:"unliked",unlike:true})
        }
        await Video.findOneAndUpdate(likeVideo._id, { $pull: { unlike: user._id } }, { new: true });
        const OwnerNotification = await addNotification(user,likeVideo.video,likeVideo.title,"Remove Unlike Your Video")
        await ownerVideo.notivication.push(OwnerNotification)
        await ownerVideo.save()
        res.status(200).json({ success: true,message:"remove unlike",unlike:false})
    } catch (error) {
        res.status(404).json({ success: false, message: error.message })
    }
}
///////////////////////////////////////////// unlike video ////////////////////////////////////////////////////////

///////////////////////////////////////////// show save to watch Later ////////////////////////////////////////////////////////
exports.showlikevideo = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id)
        if(!user) return res.status(404).json({success:false,message:"user not found"})
        const showLikeVideo = await Video.find({_id:user.likesVideos})
        res.status(201).json({ success: true, showLikeVideo})
    } catch (error) {
        res.status(404).json({ success: false, message: error.message })
    }
}
///////////////////////////////////////////// show save to watch Later ////////////////////////////////////////////////////////

///////////////////////////////////////////// delete my video ////////////////////////////////////////////////////////
exports.deleteMyvideo = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id)
        if(!user) return res.status(404).json({success:false,message:"user not found"})
        await User.findOneAndUpdate(user._id,{$pull:{post:req.params.id}},{new:true})
        const video = await Video.findById(req.params.id)
        const axistFile = await fs.existsSync(video.video)
        if(axistFile){
            fs.unlink(video.video,(err)=>{
                if(err){console.log(err)}
            })
        }
        await Video.findByIdAndDelete(video._id)
        res.status(201).json({ success: true,message:"delete success fully"})
    } catch (error) {
        res.status(404).json({ success: false, message: error.message })
    }
}
///////////////////////////////////////////// delete my video ////////////////////////////////////////////////////////



///////////////////////////////////////////// unsaveWatchLater video ////////////////////////////////////////////////////////
exports.unsavewatchLater = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id)
        if(!user) return res.status(404).json({success:false,message:"user not found"})
        await User.findOneAndUpdate(user._id, { $pull: { watchLater: req.params.id } }, { new: true });
        res.status(201).json({ success: true,message:"unlike success fully"})
    } catch (error) {
        res.status(404).json({ success: false, message: error.message })
    }
}
///////////////////////////////////////////// unsaveWatchLater video ////////////////////////////////////////////////////////

///////////////////////////////////////////////// video ////////////////////////////////////////////////////////
exports.video = async (req, res, next) => {
    try {
        let like;
        let unlike;
        const user = await User.findById(req.user._id)
        const video = await Video.findOne({_id:req.params.id})
        if(!video && !user) return res.status(500).json({success:false,message:"video not found"})
        const comments = await Comment.find({_id:video.comments})
        const findviews = video.veiws.filter((elm)=>{
            return JSON.stringify(elm._id) === `"${req.user._id}"`
        })
        if(findviews.length ===0){
            await video.veiws.push(req.user._id)
            await video.save()
            const history = await History({
                video:video.video,
                videoId:video._id,
                title:video.title
            })
            await history.save()
            await user.history.push(history._id)
            await user.save()
        }
        const findLike = video.like.filter((elm)=>{
            return JSON.stringify(elm._id) === `"${req.user._id}"`
        })
        const findUnlike = video.unlike.filter((elm)=>{
            return JSON.stringify(elm._id) === `"${req.user._id}"`
        })
        if(findLike.length ===0){
           like=false
        }else{
            like=true
        }
        if(findUnlike.length ===0){
           unlike=false
        }else{
            unlike=true
        }
        // const existFile = fs.existsSync(video.video)
        // if(existFile){
        //     const stat = fs.statSync(video.video)
        //     const filesize = stat.size;
        //     const range = req.headers.range;
        //     const part = range.replace
        // }
        res.status(200).json({success:true,video,like,unlike,comments})
    } catch (error) {
        res.status(404).json({ success: false, message: error.message })
    }
}
//////////////////////////////////////////////// video ////////////////////////////////////////////////////////

/////////////////////////////////////////////////get video owner////////////////////////////////////////////////////////
exports.getOwner = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id)
        const owner = await User.findById(req.params.id)
        const alreadySubcribe = owner.subcriber.filter((elm)=>{
            return JSON.stringify(elm._id) === JSON.stringify(user._id)
        })
        if(alreadySubcribe.length===0){
            return res.status(200).json({success:true,owner,subcribe:false})
        }
        res.status(200).json({success:true,owner,subcribe:true})
    } catch (error) {
        res.status(404).json({ success: false, message: error.message })
    }
}
////////////////////////////////////////////////get video owner////////////////////////////////////////////////////////

///////////////////////////////////////////////// subcribe user////////////////////////////////////////////////////////
exports.subcribe = async (req, res, next) => {
    try {
        const video = await Video.findById(req.params.id)
        const user = await User.findById(req.user._id)
        const owner = await User.findById(req.body.id)
        if(!owner || !user ||!video) return res.status(400).json({success:false,message:"not found user"})
        const alreadySubcribe = owner.subcriber.filter((elm)=>{
            return JSON.stringify(elm._id) === JSON.stringify(user._id)
        })
        if(alreadySubcribe.length===0){
            const notivicationId = await addNotification(user,video.video,video.title,"Your New Subcribe")
            await owner.subcriber.push(user._id)
            await owner.notivication.push(notivicationId)
            await owner.save()
            return res.status(200).json({success:true,message:"subcribed"})
        }
        await User.findOneAndUpdate(owner._id,{$pull:{subcriber:user._id}},{new:true})
        const notivicationId = await addNotification(user,video.video,video.title,"UnSubcribe You")
        await owner.notivication.push(notivicationId)
        await owner.save()
        res.status(200).json({success:true,message:"Unsubcribe"})
    } catch (error) {
        res.status(404).json({ success: false, message: error.message })
    }
}
//////////////////////////////////////////////// subcribe user////////////////////////////////////////////////////////

///////////////////////////////////////////////// notification////////////////////////////////////////////////////////
exports.notification = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id)
        if( !user) return res.status(400).json({success:false,message:"not found user"})
        const notification = await Notification.find({_id:user.notivication})
        res.status(200).json({success:true,notification})
    } catch (error) {
        res.status(404).json({ success: false, message: error.message })
    }
}
//////////////////////////////////////////////// notification////////////////////////////////////////////////////////

///////////////////////////////////////////////// myAccount////////////////////////////////////////////////////////
exports.myAccount = async (req, res, next) => {
    try {
        const data = await User.findById(req.user._id)
        if( !data) return res.status(400).json({success:false,message:"not found user"})
        res.status(200).json({success:true,data})
    } catch (error) {
        res.status(404).json({ success: false, message: error.message })
    }
}
//////////////////////////////////////////////// myAccount////////////////////////////////////////////////////////

///////////////////////////////////////////////// logOUt////////////////////////////////////////////////////////
exports.logOUt = async (req, res, next) => {
    try {
        if(req.user){
            req.user = null
        }
        res.status(200).json({success:true,message:"logout successfully"})
    } catch (error) {
        res.status(404).json({ success: false, message: error.message })
    }
}
//////////////////////////////////////////////// logOUt////////////////////////////////////////////////////////


///////////////////////////////////////////////// removiHistory ////////////////////////////////////////////////////////
exports.removiHistory  = async (req, res, next) => {
    try {
        const video = History.findById(req.params.id)
        const user = await User.findById(req.user._id)
        if(!video|| !user) return res.status(500).json({success:false,message:"not found"})
        await User.findOneAndUpdate(user._id,{$pull:{history:video._id}},{new:true})
        await History.findByIdAndDelete(video._id)
        res.status(200).json({success:true,message:"removiHistory  successfully"})
    } catch (error) {
        res.status(404).json({ success: false, message: error.message })
    }
}
//////////////////////////////////////////////// removiHistory ////////////////////////////////////////////////////////

///////////////////////////////////////////////// showHistory ////////////////////////////////////////////////////////
exports.showHistory  = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id)
        if(!user) return res.status(500).json({success:false,message:"not found"})
        const history = await History.find({_id:user.history})
        res.status(200).json({success:true,history})
    } catch (error) {
        res.status(404).json({ success: false, message: error.message })
    }
}
//////////////////////////////////////////////// showHistory ////////////////////////////////////////////////////////

///////////////////////////////////////////////// userProfile ////////////////////////////////////////////////////////
exports.userProfile  = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id)
        if(!user) return res.status(500).json({success:false,message:"not found"})
        const userVideos = await Video.find({_id:user.post})
        res.status(200).json({success:true,user,userVideos})
    } catch (error) {
        res.status(404).json({ success: false, message: error.message })
    }
}
//////////////////////////////////////////////// userProfile ////////////////////////////////////////////////////////



