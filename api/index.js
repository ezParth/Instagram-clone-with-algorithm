import express, { urlencoded } from "express";
import cors from "cors"
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
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

app.get("/", (req, res) => {
    res.json("Hello World")
})

app.listen(PORT, () => {
    console.log(`App Listening on PORT ${PORT}`);
})