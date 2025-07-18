"use client"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useEffect, useState } from "react";


export default function LoginForm(){
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const router = useRouter();
    // const [user, setUser] = useState({
    //     email: "",
    //     password: ""
    // })
    // const handleLogin = async (e)=>{
    //     e.preventDefault()
    //     console.log(user)
    //     const response = await axios.post("/api/users/login", user)
    //     console.log('response',response)
    // }


    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!e.target.email.value && !e.target.password.value){
            setError("All fields are required")
            return null
        }
        
        try{
            setLoading(true)
            signIn("credentials", { email:e.target.email.value, password:e.target.password.value, redirect: false }).then( async(res)=>{
                console.log('login....', res.error)
                if(res.error){
                    setError("Invalid email/password..")
                    setLoading(false)
                } else{
                    router.push("/blog");
                    router.refresh()
                }
            })
        } catch(err){
            setError(err)
            setLoading(false)
        } finally{
        }
      };
console.log('setError', error)
    return(
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input 
                type="email"
                name="email"
                placeholder="Enter email"
            />
            <Input
                type="password"
                name="password"
                placeholder="Enter password"
            />
            <Button type="submit" disabled={loading}>{loading ? "logging...": "Login"}</Button>
            {error && error}
        </form>
    )
}