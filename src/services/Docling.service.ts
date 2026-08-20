import fs from "fs"
import FromData from "form-data"
import axios from "axios"
import { ApiError } from "../utils/ApiError.js"

export const parseWithDocling = async(filePath : string) => {

    const formData = new FromData();

    if(!filePath)
        throw new ApiError(200, "file is not reached to docling srvies")

    formData.append(
        "file",
        fs.createReadStream(filePath)
    )

    const response = await axios.post(
        `${process.env.DOCLING_URL}/parse`,
        formData,
        {
            headers: formData.getHeaders()
        }
    )

    return response.data
    
}
