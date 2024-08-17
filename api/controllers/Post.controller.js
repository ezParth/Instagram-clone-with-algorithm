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
        await post.populate({path: 'author', select:'-password'})// ye author ke ander info instert krega naaki post ke ander // isme user ki saari details to aaengi but password nahi aaega
        return res.status(201).json({
            message: "New Post added!",
            post
        })
    } catch (error) {
        console.log("Error adding the Post", error);
    }
}

export const getAllPost = async (req, res) => {
    try {
        const posts = await Post.find().sort({createdAt:-1})//sorting post in increasing order of time so that we can see recently created posts first
        .populate({path:'author', select:'username, profilepicture'})
        .populate({path:'comments', sort:{createdAt:-1}, populate:{path:'author', select:'username, profilePicture'}})
        return res.status(200).json({
            message: "successfull retrived all posts",
            posts,
        })
    } catch (error) {
        console.log("Error getting all Post", error)
    }
}

export const getUserPost = async (req, res) => {
    try {
        const authorId = req.id;// getting from authentication
        const posts = await Post.find({author: authorId})// Post ke ander jo author hai aur ham jo authorId provide krwa rhe hai dono match krne chahiye
        .sort({createdAt:-1})
        .populate({path: 'author', select:'username, profilePicture'})
        .populate({path:'comments', sort: {createdAt:-1}, populate:{path:'author', select:'username, profilePicture'}})
        return res.status(200).json({
            message: `successfully retrived the posts created by ${posts.username}`,
            posts
        })
    } catch (error) {
        console.log("Error getting user's posts", error);
    }
}