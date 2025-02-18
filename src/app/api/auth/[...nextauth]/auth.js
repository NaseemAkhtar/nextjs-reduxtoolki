import NextAuth from "next-auth";
import { connect } from "@/db";
import { User } from "@/models/user.model";
import CredentialProvider from "next-auth/providers/credentials"
import { compare } from "bcryptjs";
import { signJwtToken } from "@/lib/jwt";
import { use } from "react";



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

                    const isPasswordMatch = await compare(password, user.password)
                    
                    if(!isPasswordMatch){
                        throw new Error({cause: "Please provide correct password"})
                    } else {
                        const {password, ...currentUser} = user._doc
                        console.log(user, 'login succesfuly???? ', currentUser)
                        const accessToken = signJwtToken(currentUser, {expiresIn: "7d"})
                        
                        return {...currentUser,accessToken}
                    }
                } catch(err){
                    throw new Error({cause: "Invalid password"})
                }
            }
        })
    ],
    callbacks: {
        async jwt({token, user}){
            if(user){
                token.accessToken = user.accessToken
                token._id = user._id
                token.name = user.name
            }
            return token
        },
        async session({session, token}){
            if(token){
                session.user._id = token._id,
                session.user.accessToken = token.accessToken
                session.user.name = token.name
            }
            return session
        }
    },
    pages: {
        signIn: "/login"
    },
    session: {
        strategy: "jwt"
        // jwt: true,
    },
    secret: process.env.TOKEN_SECRET
}