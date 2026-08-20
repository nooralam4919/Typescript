import jwt, { type SignOptions } from "jsonwebtoken";
import { ApiError } from "./ApiError.js";

const generateAccessToken = (id: string, email: string): string => {
  const secret = process.env.ACCESS_TOKEN_SECRET;
  const expiryTime = process.env.ACCESS_TOKEN_EXPIRY;

  if (!secret) {
    throw new ApiError(500, "ACCESS_TOKEN_SECRET is not defined");
  }

  if (!expiryTime) {
    throw new ApiError(500, "ACCESS_TOKEN_EXPIRY is not defined");
  }

  return jwt.sign(
    {
      id,
      email,
    },
    secret,
    {
      expiresIn: expiryTime as SignOptions["expiresIn"],
    }
  );
};


const generateRefreshToken = (id: string) =>{
    if(!id)
      throw new ApiError(400, "id is not found in jwt file");
    const refres = process.env.REFRESH_TOKEN;
    const expiryTime = process.env.REFRESH_TOKEN_EXPIRY;

    if(!refres)
      throw new ApiError(400, "REFERESH TOKEN")


    return jwt.sign(
      {
        id,
      },
      refres,
      {
        expiresIn: expiryTime as SignOptions["expiresIn"],
      }
    )
}

export { generateAccessToken, generateRefreshToken };