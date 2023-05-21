import dotenv from "dotenv";
dotenv.config()
export const config = {

    port: process.env.PORT,

    mongo_url: process.env.MONGO_URL,

    cookie_secret:process.env.COOOKIE_SECRET,

    secret_session:  process.env.SECRET_SESSION,

    github_client_Id: process.env.GITHUB_CLIENT_ID,

    github_client_secret: process.env.GITHUB_CLIENT_SECRET,

    github_callback_url:process.env.GITHUB_CALLBACK_URL,

    persistence: process.env.PERSISTENCE

} 