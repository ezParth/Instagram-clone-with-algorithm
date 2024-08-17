import Conversation from "../model/Conversation.js";
import Message from "../model/Message.js";

export const sendMessage = async (req, res) => {
  try {
    const senderId = req.id;
    const recieverId = req.params.id;
    const { message } = req.body;

    //checking if conversation is established or not
    let conversation = await Conversation.findOne({
      participants: { $all: { senderId, recieverId } },
    });
    //establish the conversation if not started yet
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, recieverId],
      });
    }
    const newMessage = await Message.create({
      senderId,
      recieverId,
      message,
    });
    if (newMessage) {
      conversation.messages.push(newMessage._id);
    }
    await Promise.all([conversation.save, newMessage]);// agar ham Promise nahi use krte to hame await lagakar dono ko alag alag save krna padta

    //implement socket.io for real time communication

    return res.status(201).json({
        message: "Conversation set up succcssfull!",
        newMessage
    })
  } catch (error) {
    console.log("Error during sending the message", error);
  }
};
