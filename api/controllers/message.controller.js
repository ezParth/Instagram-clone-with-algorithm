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

export const getMessage = async (req, res) => {
    try {
        const senderId = req.id;
        const recieverId = req.params.id;
        const conversation = await Conversation.find({
            participants: {$all: {senderId, recieverId}}
        })       
        if(!conversation){
            return res.status(200).json({
                message: []
            })
        }//there is no message which means covnersation is empty
        return res.status(200).json({
            messages: conversation?.messages
        })// ? because if conversation is undefined then it will give an error as undefined ka . nikalne se error aata hai      
        
    } catch (error) {
        console.log("Error getting the messages", error);
    }
}