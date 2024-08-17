import sharp from "sharp";
import cloudinary from "../utils/cloudinary.js";
import Post from "../model/Post.js";
import User from "../model/User.js";
import Comment from "../model/Comment.js";

export const addNewPost = async (req, res) => {
  try {
    const { caption } = req.body;
    const image = req.file;
    const authorId = req.id; // we are getting this from the isAuthenticated middleware.
    if (!image) {
      return res.status(401).json({
        message: "Image required!",
      });
    }
    //image upload using sharp
    console.log("Image: ", image);
    const optimizedImageBuffer = await sharp(image.buffer)
      .resize({ width: 800, height: 800, fit: "inside" })
      .toFormat("jpeg", { quality: 80 })
      .toBuffer();
    console.log("image buffer", optimizedImageBuffer);

    //converting image to data uri
    const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString(
      "base64"
    )}`;
    console.log("fileUri", fileUri);
    const cloudResponse = await cloudinary.uploader.upload(fileUri);
    const post = await Post.create({
      caption,
      image: cloudResponse.secure_url,
      author: authorId,
    });
    // Now we need to push this post to User.model.js to posts section as it is referenced to Post schema
    const user = await User.findById(authorId);
    if (user) {
      user.posts.push(post._id); // pushing the id of the post in the posts array of the user.model schema and then further if you want you can populate the posts and get the full post info
      await user.save();
    }
    await post.populate({ path: "author", select: "-password" }); // ye author ke ander info instert krega naaki post ke ander // isme user ki saari details to aaengi but password nahi aaega
    return res.status(201).json({
      message: "New Post added!",
      post,
    });
  } catch (error) {
    console.log("Error adding the Post", error);
  }
};

export const getAllPost = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 }) //sorting post in increasing order of time so that we can see recently created posts first
      .populate({ path: "author", select: "username, profilepicture" })
      .populate({
        path: "comments",
        sort: { createdAt: -1 },
        populate: { path: "author", select: "username, profilePicture" },
      });
    return res.status(200).json({
      message: "successfull retrived all posts",
      posts,
    });
  } catch (error) {
    console.log("Error getting all Post", error);
  }
};

export const getUserPost = async (req, res) => {
  try {
    const authorId = req.id; // getting from authentication
    const posts = await Post.find({ author: authorId }) // Post ke ander jo author hai aur ham jo authorId provide krwa rhe hai dono match krne chahiye
      .sort({ createdAt: -1 })
      .populate({ path: "author", select: "username, profilePicture" })
      .populate({
        path: "comments",
        sort: { createdAt: -1 },
        populate: { path: "author", select: "username, profilePicture" },
      });
    return res.status(200).json({
      message: `successfully retrived the posts created by ${posts.username}`,
      posts,
    });
  } catch (error) {
    console.log("Error getting user's posts", error);
  }
};

export const likePost = async (req, res) => {
  try {
    const userWhoIsLiking = req.id;
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        messgae: "Post not found!",
      });
    }
    await post.updateOne({ $addToSet: { likes: userWhoIsLiking } });
    await post.save();

    //implementing socket.io for real time notification

    return res.status(200).json({
      messgae: "post liked successfully!",
    });
  } catch (error) {
    console.log("Error in liking the post {server side}", error);
  }
};

export const dislikePost = async (req, res) => {
  try {
    const userWhoIsDisliking = req.id;
    const postId = req.params.id;
    const post = Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        message: "post not found",
      });
    }
    await post.updateOne({ $pull: { likes: userWhoIsDisliking } });
    await post.save();

    return res.status(200).json({
      message: "post disliked!",
    });
  } catch (error) {
    console.log("Error during disliking the post", error);
  }
};

export const addComment = async (req, res) => {
  try {
    const personWhoIsCommenting = req.id;
    const postId = req.params.id;
    const { text } = req.body;
    const post = await Post.findById(postId);
    if (!text) {
      return res.status(404).json({
        message: "nothing to comment :{",
      });
    }
    const comment = await Comment.create({
      text,
      author: personWhoIsCommenting,
      post: postId,
    }).populate({
      path: "author",
      select: "username, profilePicture",
    });
    post.comments.push(comment._id);
    await post.save();
    await post.updateOne({ $push: { comments: personWhoIsCommenting } });
    return res.status(201).json({
      message: "comment added successfully",
    });
  } catch (error) {
    console.log("Error in adding comments", error);
  }
};

export const getComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const comments = await Comment.find({ post: postId }) // finding the comments of the post with a specific id of post called postId// mtlb is id waali post ke comments ko ham retrive(nikal) rhe hai
      .populate("author", "username, profilePicture");
    if (!comments) {
      return res.status(404).json({
        message: "No comments found on this post!",
      });
    }
    return res.status(200).json({
      message: "Comments retrived:}",
      comments,
    });
  } catch (error) {
    console.log("Error getting the comments of this post", error);
  }
};

export const deletePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const authorId = req.id;
        const post = await Post.findById(postId);
        if(!psot){
            return res.status(404).json({
                message: "post not found!"
            })
        }
        if(post.author.toString() !== authorId){
            res.status(403).json({
                message:"unAuthorized"
            })
        }

        //remove the postId from Post
        await Post.findByIdAndDelete(postId)

        // remove the id of the post from user.posts also
        let user = await User.findById(authorId)
        user.posts = user.posts.filter( id => id.toString() !== postId)// we are converting it to toString because id is stored as an object in database and also user.post is an array so we can apply filter method of javascipt here to filter out all the required posts
        await user.save();

        //delete associated comments
        await Comment.deleteMany({post: postId})// comment schema ke ander post hai jisme har post ki ek id hai aur jo id bhi postId se milti hai unko ham yaha par delete kr rhe hai

        return res.status(200).json({
            message: "deleted Post successfully"
        })
    } catch (error) {
        console.log("Error in deleting the post", error)
    }
}
