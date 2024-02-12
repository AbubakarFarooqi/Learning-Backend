import {v2 as cloudinary} from 'cloudinary';
import fs from "fs"
import  dotenv from "dotenv"

dotenv.config()

cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.CLOUD_API_KEY, 
  api_secret: process.env.CLOUD_API_SECRET 
});


const uploadOnCloundinary = async (localPath)=>{
    try {

        if(!localPath) return null
        const response =  await cloudinary.uploader.upload(localPath,{
            resource_type: "auto"
        })
        console.log(`File uploaded on cloundinary at: ${response.url}`);
        
        fs.unlinkSync(localPath)

        return response.url
    } catch (error) {
        console.log("Cloudinary Error:",error)
        fs.unlinkSync(localPath)
        return null       
    }
}

export default uploadOnCloundinary