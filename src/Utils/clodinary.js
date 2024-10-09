import {v2 as cloudinary} from "cloudinary";
import fs from "fs";

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET// Click 'View API Keys' above to copy your API secret
});

const uploadFile = async (FilePath) => {
    try {
        if(!FilePath) return null;
        const result = await cloudinary.uploader.upload(FilePath , {
            resource_type : 'auto'
        })
        console.log('File uploaded successfully');
        fs.unlinkSync(FilePath)
        return  result.url;

    } catch (Error) {
        fs.unlink(FilePath , () => {
            console.log('unable to upload file' , Error);
        })
    }
}

export default uploadFile;