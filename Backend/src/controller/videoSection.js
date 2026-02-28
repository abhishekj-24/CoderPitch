const cloudinary = require('cloudinary').v2
const Problem = require('../models/problem')
const User = require('../models/user')
const solvideo = require('../models/viedeo')
const { sanitizeFilter } = require('mongoose');

cloudinary.config({
    cloud_name: process.env.Cloud_cloudname,
    api_key: process.env.Cloud_API_Key,
    api_secret: process.env.Cloud_Secret_API
})

const genUploadSig = async (req, res) => {
    try {
        const { problemId } = req.params;
        const userId = req.result._id;

        //find problem
        const problem = await Problem.findById(problemId);

        if (!problem) {
            return res.status(404).json({ error: 'Problem not found' });
        }

        // Generate unique public_id for the video
        const timestamp = Math.round(new Date().getTime() / 1000);
        const publicId = `leetcode-solutions/${problemId}/${userId}_${timestamp}`;

        // Upload parameters
        const uploadParams = {
            timestamp: timestamp,
            public_id: publicId,
        };

        // Generate signature
        const signature = cloudinary.utils.api_sign_request(
            uploadParams,
            process.env.Cloud_Secret_API
        );

        res.json({
            signature,
            timestamp,
            public_id: publicId,
            api_key: process.env.Cloud_API_Key,
            cloud_name: process.env.Cloud_cloudname,
            upload_url: `https://api.cloudinary.com/v1_1/${process.env.Cloud_cloudname}/video/upload`,
        });

    } catch (error) {
        console.error('Error generating upload signature:', error);
        res.status(500).json({ error: 'Failed to generate upload credentials' });
    }
};


const saveVideoMetadata = async (req, res) => {
    try {
        const {
            problemId,
            cloudinaryPublicId,
            secureUrl,
            duration,
        } = req.body;

        const userId = req.result._id;

        // Verify the upload with Cloudinary
        const cloudinaryResource = await cloudinary.api.resource(
            cloudinaryPublicId,
            { resource_type: 'video' }
        );

        if (!cloudinaryResource) {
            return res.status(400).json({ error: 'Video not found on Cloudinary' });
        }

        // Check if video already exists for this problem and user
        const existingVideo = await solvideo.findOne({
            problemId,
            userId,
            coudinarypubId: cloudinaryPublicId
        });

        if (existingVideo) {
            return res.status(409).json({ error: 'Video already exists' });
        }

        // If client provided a thumbnailUrl use it, otherwise generate one from Cloudinary
        let thumbnailUrl = req.body.thumbnailUrl;
        if (!thumbnailUrl) {
            // create a small snapshot from the video (first frame)
            thumbnailUrl = cloudinary.url(cloudinaryResource.public_id, {
                resource_type: 'video',
                transformation: [
                    { width: 400, height: 225, crop: 'fill' },
                    { quality: 'auto' },
                    { fetch_format: 'auto' },
                    { start_offset: '0' }
                ]
            });
        }

        // Create video solution record
        const videoSolution = new solvideo({
            problemId,
            userId,
            coudinarypubId: cloudinaryPublicId,
            secureUrl,
            duration: cloudinaryResource.duration || duration,
            thumbnailUrl
        });

        await videoSolution.save();


        res.status(201).json({
            message: 'Video solution saved successfully',
            videoSolution: {
                id: videoSolution._id,
                thumbnailUrl: videoSolution.thumbnailUrl,
                duration: videoSolution.duration,
                uploadedAt: videoSolution.createdAt
            }
        });

    } catch (error) {
        console.error('Error saving video metadata:', error);
        res.status(500).json({ error: 'Failed to save video metadata' });
    }
};


const deleteVideo = async (req, res) => {
    try {
        const { videoId } = req.params;
        const userId = req.result._id;        
        
        const video = await solvideo.findByIdAndDelete({videoId :videoId});

        if (!video) {
            return res.status(404).json({ error: 'Video not found' });
        }


        await cloudinary.uploader.destroy(video.coudinarypubId, { resource_type: 'video', invalidate: true });

        res.json({ message: 'Video deleted successfully' });

    } catch (error) {
        console.error('Error deleting video:', error);
        res.status(500).json({ error: 'Failed to delete video' });
    }
};

module.exports = { genUploadSig, saveVideoMetadata, deleteVideo };