import NextAuth from "next-auth";
import { connect } from "@/db";
import { User } from "@/models/user.model";
import CredentialProvider from "next-auth/providers/credentials"
import { compare } from "bcryptjs";
import { signJwtToken, verifyJwtToken } from "@/lib/jwt";

async function refreshAccessToken(token) {
  try {
    const verified = verifyJwtToken(token.refreshToken);

    if (!verified) {
      throw new Error("Invalid refresh token");
    }

    // If valid, issue new access token
    const accessToken = signJwtToken(
      { _id: verified._id, email: verified.email },
      { expiresIn: "10m" }
    );

    return {
      ...token,
      accessToken,
      accessTokenExpires: Date.now() + 10 * 60 * 1000,
    };
  } catch (error) {
    console.error("Error refreshing access token:", error);

    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

export const options = {
    providers: [
        CredentialProvider({
            name: "Credentials",
            credentials: {
                email: {
                    label: "Email",
                    type: "email"
                },
                password: {
                    label: "Password",
                    type: "password"
                }
            },
            // type: "credentials",
            // credentials:{},
            authorize: async (credentials)=>{
                const { email, password } = credentials;
                
                if(!email || !password) {
                    throw new Error({cause: "Please provide email and password"})
                }
                try{
                    await connect()
                    const user = await User.findOne({email}).select('+password')
                    
                    if(!user){
                        throw new Error({cause: "Please provide valid email and password"})
                    }
                    
                    const isPasswordMatch = await compare(credentials.password, user.password)
                    
                    if(!isPasswordMatch){
                        throw new Error({cause: "Please provide correct password"})
                    }  
                    // else {
                        //         // const {password, ...currentUser} = user._doc
                        //         // const accessToken = signJwtToken(currentUser, {expiresIn: "7d"})
                        
                        //         // return {...currentUser,accessToken}
                        
                        //     }
                        // const {password, ...currentUser} = user._doc
                    const currentUser = user.toObject();
                    delete currentUser.password;
                    const accessToken = signJwtToken(currentUser, { expiresIn: "10m" });
                    const refreshToken = signJwtToken(currentUser, { expiresIn: "7d" });
                    
                    return {
                        ...currentUser,
                        accessToken,
                        refreshToken,
                        accessTokenExpires: Date.now() + 10 * 60 * 1000
                    }
                } catch(err){
                    throw new Error({cause: "Invalid password"})
                }
            }
        })
    ],
    callbacks: {
        async jwt({token, user}){
            console.log('check refresh token>>>>>>>>>>>.....new', {token})
            if(user){
                token.accessToken = user.accessToken
                token.refreshToken = user.refreshToken
                token.accessTokenExpires = user.accessTokenExpires
                token._id = user._id
                token.name = user.name
            }
            if(Date.now() < token.accessTokenExpires){
                console.log('Date.now() < token.accessTokenExpires..', Date.now() < token.accessTokenExpires)
                return token
            }
            
            console.log('Request for refresh token>>>>>>..', token)
            //If accessToken has expired try to reresh token
            return await refreshAccessToken(token)
        },
        async session({session, token}){
            console.log('session token>>>>>>..', token)
            if(token){
                session.user._id = token._id,
                session.user.accessToken = token.accessToken
                session.user.refreshToken = token.refreshToken
                session.user.name = token.name
                session.user.error = token.error
            }
            return session
        }
    },
    pages: {
        signIn: "/login"
    },
    session: {
        strategy: "jwt",
        // jwt: true,
    },
    secret: process.env.TOKEN_SECRET
}