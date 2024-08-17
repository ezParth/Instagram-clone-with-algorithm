import express, { urlencoded } from "express";
import cors from "cors"
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoute from "./routes/user.route.js"
import postRoute from "./routes/post.route.js"
import messageRoute from "./routes/message.route.js"

dotenv.config({})

const app = express()

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({extended:true}))
const corsOptions = {
    origin: "http://localhost:5173",
    credentials:true,
}
app.use(cors(corsOptions))

mongoose.connect(process.env.Mongo_DB)
.then(() => console.log(`MongoDB Connected`))
.catch((e) => console.log("Error in Conntecting Mongodb",err))

app.use("/api/v1/user", userRoute)
app.use("/api/v1/post", postRoute)
app.use("/api/v1/message", messageRoute)

app.listen(PORT, () => {
    console.log(`App Listening on PORT ${PORT}`);
})