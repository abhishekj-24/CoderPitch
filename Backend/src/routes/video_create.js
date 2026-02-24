const express = require('express');
const adminMiddleware = require('../middleware/adminmiddleware');
const videoRouter =  express.Router();
const { genUploadSig, saveVideoMetadata, deleteVideo } = require("../controller/videoSection")

videoRouter.get("/create/:problemId",adminMiddleware,genUploadSig);
videoRouter.post("/save",adminMiddleware,saveVideoMetadata);
videoRouter.delete("/delete/:videoId",adminMiddleware,deleteVideo);


module.exports = videoRouter;