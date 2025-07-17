const multer =require("multer");

//set storage engine
const storage= multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"uploads/");
    },
    filename:(req,file,cb)=>{
        cb(null,Date.now()+"-"+ file.originalname);
    },
});

//check file type
const fileFilter= (req,file,cb)=>{
    if(file.mimetype.startsWith("image/")){
        cb(null,true);
    }else{
        cb(new Error("Only images are allowed!"),false);
    }
};

//set up multer
const upload = multer({
    storage,
    fileFilter,
    limits:{
        fileSize: 1024 * 1024 *5,
    }
});

const UploadToCloudinary = async (file) => {
    try {
        const result = await cloudinary.uploader.upload(file.path);
        return result.secure_url;
    } catch (error) {
        console.error("Error uploading to Cloudinary:", error);
        throw error;
    }
};

module.exports = { upload, UploadToCloudinary };