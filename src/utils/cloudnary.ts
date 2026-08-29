import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinay = async (localFilePath: string) => {
    try {
        if (!localFilePath) {
            console.log("File path is not defined");
            return null;
        }

        console.log("Uploading file:", localFilePath);

        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
        });

        console.log("File uploaded successfully");
        console.log("URL:", response.secure_url);
        // fs.unlinkSync(localFilePath);
        return response;

    } catch (error) {
        console.error("Cloudinary upload error:", error);
        fs.unlinkSync(localFilePath);

        return null;
    }
};

export { uploadOnCloudinay };