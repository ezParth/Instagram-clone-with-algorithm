import { v2 as cloudinary } from 'cloudinary';// here we have changed name of v1 as cloudinary as we wanted to import v1 but we wanted to give it a name such a "cloudinary"
import dotenv from "dotenv";
dotenv.config({}); 

cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.API_KEY, 
    api_secret: process.env.API_SECRET,
});

export default cloudinary;