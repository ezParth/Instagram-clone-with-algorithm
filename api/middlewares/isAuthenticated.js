import jwt from "jsonwebtoken"
import dotenv from "dotenv";
dotenv.config({});

const isAuthenticated = async (req, res, next) => {
    try {
         const token = req.cookies.token;
         if(!token){
            res.status(401).json({
                message: "User is not Authenticated"
            })
         }    
         const decode = await jwt.verify(token, process.env.SECRET_TOKEN)   
         if(!decode){
            return res.status(401).json({
                message: "Invalid Token",
            })
         }
         req.id = decode.userId;// this userId comes from the jwt.sign(userId: user._id)
         next();
    } catch (error) {
        console.log("Error during Authentication",error);
    }
}

export default isAuthenticated;