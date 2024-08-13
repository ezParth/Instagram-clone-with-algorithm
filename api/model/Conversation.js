import mongoose from "mongoose";

const conversationSchema = new mongoose.model({
    participents:{type: mongoose.Schema.Types.ObjectId, ref: "User"},
    message: {type: mongoose.Schema.Types.ObjectId, ref: "message"}
})

const Conversation = mongoose.model("Conversation", conversationSchema)

module.exports = Conversation;