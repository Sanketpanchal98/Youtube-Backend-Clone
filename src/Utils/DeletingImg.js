import {v2 as cloudinary} from 'cloudinary';

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET// Click 'View API Keys' above to copy your API secret
});

const deleteCLoudinaryFile = async (imageURI) => {
    try {
        
        if(!imageURI) return null;
        await cloudinary.v2.uploader
        .destroy(imageURI)
        .then(result=>console.log(result));

    } catch (error) {
        console.log("error : " , error);
    }
}

export default deleteCLoudinaryFile;