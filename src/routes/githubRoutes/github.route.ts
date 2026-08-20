import { Router } from "express";
import { gitLogin, githubCallback } from "../../controllers/userController/GithubAuth/Github.register.controller.js"


const router = Router();


router.route("/github").get(gitLogin);
router.route("/github/callback").get(githubCallback);


export default router;






















// import { Router, Request, Response } from "express";
// import { generateAccessToken, generateRefreshToken } from "../../utils/jwt.js";
// import prisma from "../../lib/prisma.js";

// const router = Router();

// const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

// const GITHUB_CALLBACK_URL = process.env.GITHUB_CALLBACK_URL || "http://localhost:4000/auth/github/callback";

// /*
// |--------------------------------------------------------------------------
// | Step 1: Start GitHub OAuth
// |--------------------------------------------------------------------------
// |
// | Frontend:
// | window.location.href = "http://localhost:4000/auth/github"
// |
// */
// router.get("/github", (req: Request, res: Response) => {
//     const clientId = process.env.GITHUB_CLIENT_ID;

//     if (!clientId) {
//         return res.status(500).json({
//             message: "GITHUB_CLIENT_ID is not configured",
//         });
//     }

//     const params = new URLSearchParams({
//         client_id: clientId, 
//         redirect_uri: GITHUB_CALLBACK_URL,
//         scope: "read:user user:email",
//     });

//     const githubUrl = `https://github.com/login/oauth/authorize?${params.toString()}`;

//     return res.redirect(githubUrl);
// });


// /*
// |--------------------------------------------------------------------------
// | Step 2: GitHub Callback
// |--------------------------------------------------------------------------
// |
// | GitHub redirects:
// |
// | /auth/github/callback?code=XXXX
// |
// */
// router.get( "/github/callback", async (req: Request, res: Response) => {

//         const { code, error } = req.query;

//         // User denied GitHub authorization
//         if (error) {
//             return res.redirect(
//                 `${FRONTEND_URL}/login?error=github_denied`
//             );
//         }

//         if (!code || typeof code !== "string") {
//             return res.redirect(
//                 `${FRONTEND_URL}/login?error=missing_code`
//             );
//         }

//         try {

//             /*
//             |--------------------------------------------------------------------------
//             | Step 3: Exchange authorization code for GitHub access token
//             |--------------------------------------------------------------------------
//             */

//             const tokenResponse = await fetch(
//                 "https://github.com/login/oauth/access_token",
//                 {
//                     method: "POST",

//                     headers: {
//                         Accept: "application/json",
//                         "Content-Type": "application/json",
//                     },

//                     body: JSON.stringify({
//                         client_id: process.env.GITHUB_CLIENT_ID,
//                         client_secret: process.env.GITHUB_CLIENT_SECRET,
//                         code,
//                         redirect_uri: GITHUB_CALLBACK_URL,
//                     }),
//                 }
//             );

//             if (!tokenResponse.ok) {
//                 console.error(
//                     "GitHub token request failed:",
//                     tokenResponse.status
//                 );

//                 return res.redirect(
//                     `${FRONTEND_URL}/login?error=github_token`
//                 );
//             }

//             const tokenData = await tokenResponse.json() as {
//                 access_token?: string;
//                 token_type?: string;
//                 scope?: string;
//                 error?: string;
//                 error_description?: string;
//             };

//             if (!tokenData.access_token) {
//                 console.error(
//                     "GitHub token error:",
//                     tokenData.error_description
//                 );

//                 return res.redirect(
//                     `${FRONTEND_URL}/login?error=github_token`
//                 );
//             }

//             const githubToken = tokenData.access_token;


//             /*
//             |--------------------------------------------------------------------------
//             | Step 4: Get GitHub user profile
//             |--------------------------------------------------------------------------
//             */

//             const profileResponse = await fetch(
//                 "https://api.github.com/user",
//                 {
//                     headers: {
//                         Authorization: `Bearer ${githubToken}`,
//                         Accept: "application/vnd.github+json",
//                         "X-GitHub-Api-Version": "2022-11-28",
//                     },
//                 }
//             );

//             if (!profileResponse.ok) {
//                 console.error(
//                     "GitHub profile request failed:",
//                     profileResponse.status
//                 );

//                 return res.redirect(
//                     `${FRONTEND_URL}/login?error=github_profile`
//                 );
//             }

//             const profile = await profileResponse.json() as {
//                 id: number;
//                 login: string;
//                 name: string | null;
//                 email: string | null;
//                 avatar_url: string;
//             };


//             /*
//             |--------------------------------------------------------------------------
//             | Step 5: Get GitHub emails
//             |--------------------------------------------------------------------------
//             */

//             const emailsResponse = await fetch(
//                 "https://api.github.com/user/emails",
//                 {
//                     headers: {
//                         Authorization: `Bearer ${githubToken}`,
//                         Accept: "application/vnd.github+json",
//                         "X-GitHub-Api-Version": "2022-11-28",
//                     },
//                 }
//             );

//             if (!emailsResponse.ok) {
//                 console.error(
//                     "GitHub email request failed:",
//                     emailsResponse.status
//                 );

//                 return res.redirect(
//                     `${FRONTEND_URL}/login?error=github_email`
//                 );
//             }

//             const emails = await emailsResponse.json() as Array<{
//                 email: string;
//                 primary: boolean;
//                 verified: boolean;
//             }>;

//             const primaryEmail =
//                 emails.find(
//                     (email) =>
//                         email.primary &&
//                         email.verified
//                 )?.email || profile.email;


//             /*
//             |--------------------------------------------------------------------------
//             | Step 6: Make sure we have an email
//             |--------------------------------------------------------------------------
//             */

//             if (!primaryEmail) {
//                 return res.redirect(
//                     `${FRONTEND_URL}/login?error=no_email`
//                 );
//             }


//             /*
//             |--------------------------------------------------------------------------
//             | Step 7: Find existing user
//             |--------------------------------------------------------------------------
//             */

//             let user = await prisma.user.findUnique({
//                 where: {
//                     email: primaryEmail,
//                 },
//             });


//             /*
//             |--------------------------------------------------------------------------
//             | Step 8: Create user if they don't exist
//             |--------------------------------------------------------------------------
//             */

//             if (!user) {

//                 user = await prisma.user.create({
//                     data: {
//                         name: profile.name || profile.login,
//                         email: primaryEmail,
//                         password: null,
//                     },
//                 });

//             }


//             /*
//             |--------------------------------------------------------------------------
//             | Step 9: Generate YOUR application's JWT
//             |--------------------------------------------------------------------------
//             */

//             const accessToken =
//                 generateAccessToken(
//                     user.id,
//                     user.email
//                 );

//             const refreshToken =
//                 generateRefreshToken(user.id);


//             /*
//             |--------------------------------------------------------------------------
//             | Step 10: Store access token
//             |--------------------------------------------------------------------------
//             |
//             | If your current database design already has accessToken,
//             | you can keep this.
//             |
//             */

//             await prisma.user.update({
//                 where: {
//                     id: user.id,
//                 },

//                 data: {
//                     accessToken,
//                 },
//             });


//             /*
//             |--------------------------------------------------------------------------
//             | Step 11: Cookie configuration
//             |--------------------------------------------------------------------------
//             */

//             const accessCookieOptions = {
//                 httpOnly: true,
//                 secure: process.env.NODE_ENV === "production",
//                 sameSite: "lax" as const,
//                 maxAge: 24 * 60 * 60 * 1000,
//             };

//             const refreshCookieOptions = {
//                 ...accessCookieOptions,
//                 maxAge: 10 * 24 * 60 * 60 * 1000,
//             };


//             /*
//             |--------------------------------------------------------------------------
//             | Step 12: Set cookies and redirect to React
//             |--------------------------------------------------------------------------
//             */

//             return res
//                 .cookie(
//                     "accessToken",
//                     accessToken,
//                     accessCookieOptions
//                 )
//                 .cookie(
//                     "refreshToken",
//                     refreshToken,
//                     refreshCookieOptions
//                 )
//                 .redirect(FRONTEND_URL);

//         } catch (error) {

//             console.error(
//                 "GitHub OAuth error:",
//                 error
//             );

//             return res.redirect(
//                 `${FRONTEND_URL}/login?error=server`
//             );
//         }
//     }
// );

// export default router;