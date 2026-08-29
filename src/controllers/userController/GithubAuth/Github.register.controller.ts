import { Request, Response } from "express";

import { ApiError } from "../../../utils/ApiError.js";
import { asyncHandler } from "../../../utils/asynHandle.js";

import prisma from "../../../lib/prisma.js";

import { generateAccessToken, generateRefreshToken,} from "../../../utils/jwt.js";


// BUG FIX: Do NOT read env vars at module top-level.
// These lines would run before dotenv.config() in index.ts,
// capturing undefined and never picking up the actual values.
// Read them inside each function so they're always fresh.

const GITHUB_CALLBACK_URL = () =>
    process.env.GITHUB_CALLBACK_URL || "http://localhost:4000/auth/github/callback";

const FRONTEND_URL = () =>
    process.env.FRONTEND_URL || "http://localhost:3000";


// =====================================================
// STEP 1  → User clicks "Continue with GitHub"
// Start GitHub Login
// =====================================================

const gitLogin = asyncHandler( async (req: Request, res: Response) => {
        const clientId = process.env.GITHUB_CLIENT_ID;

        // Check GitHub Client ID
        if (!clientId) {
            throw new ApiError(
                500,
                "GitHub Client ID is missing"
            );
        }

        // Create GitHub parameters
        const params = new URLSearchParams({
            client_id: clientId,
            redirect_uri: GITHUB_CALLBACK_URL(),
            scope: "read:user user:email",
        });

        // Create GitHub authorization URL
        const githubUrl = `https://github.com/login/oauth/authorize?${params.toString()}`;

        // Send browser to GitHub
        return res.redirect(githubUrl);
    }
);


// =====================================================
// STEP 2  → Backend creates GitHub authorization URL
// GitHub Callback
// =====================================================

const githubCallback = asyncHandler( async (req: Request, res: Response) => {
        const clientId     = process.env.GITHUB_CLIENT_ID;
        const clientSecret = process.env.GITHUB_CLIENT_SECRET;

        // Get code from GitHub
        const { code, error } = req.query;

        // User rejected GitHub authorization
        if (error) {
            return res.redirect(`${FRONTEND_URL()}/login?error=github_denied`);
        }

        // No code received
        if (!code) {
            return res.redirect(`${FRONTEND_URL()}/login?error=no_code`);
        }

        // Convert code to string
        const githubCode = code.toString();

        // =================================================
        // STEP 3  → GitHub shows login/authorization page
        // Exchange code for GitHub access token
        // =================================================

        const tokenResponse = await fetch(
            "https://github.com/login/oauth/access_token",
            {
                method: "POST",

                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                },

                body: JSON.stringify({
                    client_id: clientId,
                    client_secret: clientSecret,
                    code: githubCode,
                    redirect_uri: GITHUB_CALLBACK_URL(),
                }),
            }
        );


        const tokenData: any = await tokenResponse.json();


        // Check token
        if (!tokenData.access_token) {

            console.log(
                "GitHub token error:",
                tokenData
            );

            return res.redirect(
                `${FRONTEND_URL()}/login?error=github_token`
            );
        }


        const githubAccessToken = tokenData.access_token;


        // =================================================
        // STEP 4
        // Get GitHub user
        // =================================================

        const githubUserResponse = await fetch(
                "https://api.github.com/user",
                {
                    method: "GET",

                    headers: {
                        "Authorization":
                            `Bearer ${githubAccessToken}`,

                        "Accept":
                            "application/vnd.github+json",
                    },
                }
            );


        if (!githubUserResponse.ok) {
            return res.redirect(
                `${FRONTEND_URL()}/login?error=github_user`
            );
        }


        const githubUser: any = await githubUserResponse.json();


        console.log(
            "GitHub User:",
            githubUser
        );


        // =================================================
        // STEP 5
        // Get GitHub email
        // =================================================

        const emailResponse =  await fetch(
                "https://api.github.com/user/emails",
                {
                    method: "GET",

                    headers: {
                        "Authorization":
                            `Bearer ${githubAccessToken}`,

                        "Accept":
                            "application/vnd.github+json",
                    },
                }
            );


        if (!emailResponse.ok) {

            return res.redirect(
                `${FRONTEND_URL()}/login?error=github_email`
            );
        }


        const emails: any[] = await emailResponse.json();


        // Find primary verified email
        const primaryEmail =
            emails.find(
                (email) =>
                    email.primary === true &&
                    email.verified === true
            );


        if (!primaryEmail) {

            return res.redirect(
                `${FRONTEND_URL()}/login?error=no_email`
            );
        }


        const email = primaryEmail.email;


        // =================================================
        // STEP 6
        // Find user in PostgreSQL
        // =================================================

        let user = await prisma.user.findUnique({
                where: {
                    email: email,
                },
            });


        // =================================================
        // STEP 7
        // Create user if doesn't exist
        // =================================================

        if (!user) {
            user = await prisma.user.create({
                    data: {

                        name:
                            githubUser.name ||
                            githubUser.login,

                        email: email,

                        // GitHub users don't have
                        // a normal password
                        password: null,
                    },
                });
        }


        // =================================================
        // STEP 8
        // Create YOUR JWT
        // =================================================

        const accessToken =
            generateAccessToken(
                user.id,
                user.email
            );


        const refreshToken =
            generateRefreshToken(
                user.id
            );




        // =================================================
        // STEP 9
        // Save access token if your DB has this field
        // =================================================

        await prisma.user.update({

            where: {
                id: user.id,
            },

            data: {
                accessToken: accessToken,
            },
        });


        await prisma.githubAccount.upsert({
        where: {
            userId: user.id,
        },

        update: {
            githubId: String(githubUser.id),
            username: githubUser.login,
            accessToken: githubAccessToken,
        },

        create: {
            userId: user.id,
            githubId: String(githubUser.id),
            username: githubUser.login,
            accessToken: githubAccessToken,
        },
    });


        // =================================================
        // STEP 10
        // Put JWT in cookies
        // =================================================

        res.cookie(
            "accessToken",
            accessToken,
            {
                httpOnly: true,

                secure:
                    process.env.NODE_ENV === "production",

                sameSite: "lax",

                maxAge:
                    24 * 60 * 60 * 1000,
            }
        );


        res.cookie(
            "refreshToken",
            refreshToken,
            {
                httpOnly: true,

                secure:
                    process.env.NODE_ENV === "production",

                sameSite: "lax",

                maxAge:
                    10 * 24 * 60 * 60 * 1000,
            }
        );


        // =================================================
        // STEP 11
        // Send user back to React
        // =================================================

        return res.redirect(
            `${FRONTEND_URL()}/`
        );
    }
);


export {
    gitLogin,
    githubCallback,
};



















//                                           ┌─────────────────┐
//                                           │ React Frontend  │
//                                           └────────┬────────┘
//                                                    │
//                                                    │ GET /auth/github
//                                                    ↓
//                                           ┌─────────────────┐
//                                           │   YOUR BACKEND  │
//                                           └────────┬────────┘
//                                                    │
//                                                    │ REDIRECT
//                                                    ↓
//                                           ┌──────────────────────────────────┐
//                                           │ GitHub /login/oauth/authorize    │
//                                           └────────┬─────────────────────────┘
//                                                    │
//                                                    ↓
//                                                GitHub Login
//                                                    │
//                                                    ↓
//                                                 User Authorizes
//                                                    │
//                                                    │ code
//                                                    ↓
//                                           ┌─────────────────┐
//                                           │   YOUR BACKEND  │
//                                           └────────┬────────┘
//                                                    │
//                                                    │ POST /login/oauth/access_token
//                                                    │
//                                                    │ client_id
//                                                    │ client_secret
//                                                    │ code
//                                                    ↓
//                                           ┌─────────────────┐
//                                           │     GitHub      │
//                                           └────────┬────────┘
//                                                    │
//                                                    │ access_token
//                                                    ↓
//                                           ┌─────────────────┐
//                                           │   YOUR BACKEND  │
//                                           └────────┬────────┘
//                                                    │
//                                                    │ GET /user
//                                                    │ Bearer access_token
//                                                    ↓
//                                           ┌─────────────────┐
//                                           │     GitHub      │
//                                           └────────┬────────┘
//                                                    │
//                                                    │ user profile
//                                                    ↓
//                                           ┌─────────────────┐
//                                           │   YOUR BACKEND  │
//                                           └────────┬────────┘
//                                                    │
//                                                    │ GET /user/emails
//                                                    │ Bearer access_token
//                                                    ↓
//                                           ┌─────────────────┐
//                                           │     GitHub      │
//                                           └────────┬────────┘
//                                                    │
//                                                    │ email addresses
//                                                    ↓
//                                           ┌─────────────────┐
//                                           │   YOUR BACKEND  │
//                                           └────────┬────────┘
//                                                    │
//                                                    │ find user
//                                                    ↓
//                                           ┌─────────────────┐
//                                           │   PostgreSQL    │
//                                           └────────┬────────┘
//                                                    │
//                                                    │ user
//                                                    ↓
//                                           ┌─────────────────┐
//                                           │   YOUR BACKEND  │
//                                           └────────┬────────┘
//                                                    │
//                                                    │ Generate YOUR JWT
//                                                    ↓
//                                                 JWT Cookie
//                                                    │
//                                                    ↓
//                                           ┌─────────────────┐
//                                           │ React Frontend  │
//                                           └─────────────────┘