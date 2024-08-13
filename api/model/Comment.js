import mongoose from "mongoose";
const commentSchema = new mongoose.Schema({
    text:{type: String, required: true},
    author:{type: mongoose.Schema.Types.ObjectId, ref: "User", required: "true"},
    post: {type: mongoose.Schema.Types.ObjectId, ref:"Post", required:"true"},
})

const comment = mongoose.model("comment", commentSchema);

module.exports = comment;