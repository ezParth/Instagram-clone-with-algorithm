import sharp from "sharp";
import cloudinary from "../utils/cloudinary.js";
import Post from "../model/Post.js"
import User from "../model/User.js";

export const addNewPost = async (req, res) => {
    try {
        const {caption} = req.body;
        const image = req.file;
        const authorId = req.id; // we are getting this from the isAuthenticated middleware.
        if(!image){
            return res.status(401).json({
                message: "Image required!"
            })
        }
        //image upload using sharp
        console.log("Image: ",image);
        const optimizedImageBuffer = await sharp(image.buffer)
        .resize({width: 800, height: 800, fit:'inside'})
        .toFormat('jpeg', {quality: 80})
        .toBuffer();
        console.log("image buffer", optimizedImageBuffer)

        //converting image to data uri
        const fileUri= `data:image/jpeg;base64,${optimizedImageBuffer.toString('base64')}`;
        console.log("fileUri", fileUri)
        const cloudResponse = await cloudinary.uploader.upload(fileUri);
        const post = await Post.create({
            caption,
            image: cloudResponse.secure_url,
            author: authorId
        })
        // Now we need to push this post to User.model.js to posts section as it is referenced to Post schema
        const user = await User.findById(authorId);
        if(user){
            user.posts.push(post._id);// pushing the id of the post in the posts array of the user.model schema and then further if you want you can populate the posts and get the full post info
            await user.save();
        }
        await post.populate({path: 'author', select:'-password'})
        return res.status(201).json({
            message: "New Post added!",
            post
        })
    } catch (error) {
        console.log("Error adding the Post", error);
    }
}