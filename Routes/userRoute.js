const { SignUp, Login, ShowVideos, MyVideos, watchLater, savewatchLater, likeVideo, showlikevideo, deleteMyvideo, unlikeVideo, unsavewatchLater, video, getOwner, subcribe, uploadvideo, notification, myAccount, logOUt, showHistory, removiHistory, userProfile, getSubcriptions } = require("../controllers/userController");
const isAuth = require("../auth/userAuth")
const router = require("express").Router();
const imageMulter = require('../utils/uploadImageHandler')
const videoMulter = require('../utils/uploadVideoHandler')


router.post("/sign-up", imageMulter, SignUp)
router.post("/login", Login)
router.get("/showvideos", isAuth, ShowVideos)
router.get("/myvideos", isAuth, MyVideos)
router.post("/watchlater", isAuth, watchLater)
router.get("/savewatchlater", isAuth, savewatchLater)
router.get("/myaccount", isAuth, myAccount)
router.put("/unsavewatchlater/:id", isAuth, unsavewatchLater)
router.get("/video/:id", isAuth, video)
router.get("/getvideoowner/:id", isAuth, getOwner)
router.post("/likevideo", isAuth, likeVideo)
router.post("/addvideo", isAuth, videoMulter, uploadvideo)
router.post("/subcribe/:id", isAuth, subcribe)
router.post("/unlikevideo", isAuth, unlikeVideo)
router.get("/showlikevideo", isAuth, showlikevideo)
router.get("/getsubcription", isAuth, getSubcriptions)
router.get("/notification", isAuth, notification)
router.put("/log-out", isAuth, logOUt)
router.delete("/deletemyvideo/:id", isAuth, deleteMyvideo)
router.delete("/removehistory/:id", isAuth, removiHistory)
router.get("/showhistory", isAuth, showHistory)
router.get("/showuser/:id", isAuth, userProfile)

module.exports = router