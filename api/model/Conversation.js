import mongoose from "mongoose";

const conversationSchema = new mongoose.model({
    participants:[{type: mongoose.Schema.Types.ObjectId, ref: "User"}],
    messages: [{type: mongoose.Schema.Types.ObjectId, ref: "message"}]
})

const Conversation = mongoose.model("Conversation", conversationSchema)

export default Conversation