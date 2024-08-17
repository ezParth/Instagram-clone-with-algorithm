import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    caption: {type: String, default:''},
    image: {type: String, required: true},
    author: {type: mongoose.Schema.Types.ObjectId, ref: "User", require: true},
    likes: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}],// this is an array of likes as we can store how many people have liked your posts
    comments: [{type: mongoose.Schema.Types.ObjectId, ref: "Comment"}]
},{timestamps: true});

const Post = mongoose.model("Post", postSchema);

module.exports = Post