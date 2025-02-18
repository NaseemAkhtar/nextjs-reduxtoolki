"use client"
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  import { Input } from "@/components/ui/input"
  import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation";
import axios from "axios"

export default function Signup(){
    const [user, setUser] = useState({
        name: "",
        email:"",
        password:""
    })
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState("")
    const route = useRouter()

    const onsubmit = async(e)=>{
        e.preventDefault()
        const {name, email, password} = user
        if([name, email, password].includes("")){
            setError("All fields are required")
            return
        }
        let pattern =  /^[a-zA-Z0-9_.±]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/
        if(!pattern.test(email)){
            setError("Please provide valid email")
            return
        }
        
        try{
            setLoading(true)
            const response = await axios.post("/api/users/signup",user)
            console.log('response', response)
            if(response){
                setSuccess("Registration successfully!")
                route.push("/login")
            } else {
                setError("Error occured while registration")
            }
        } catch(err){
            setError(err)
        }finally{
            setLoading(false)
        }
        
    }
    return(
    <div className="naseem flex justify-center">
        <Card>
            <CardHeader>
            <CardTitle>Signup</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={onsubmit} className="flex flex-col gap-4">
                    <Input
                        type="text"
                        name="name"
                        placeholder="Enter your name"
                        onChange={(e)=>setUser(prev=> ({...prev, name:e.target.value}))}
                    />
                    <Input
                        type="email"
                        name="email"
                        placeholder="Enter email"
                        onChange={(e)=>setUser(prev=> ({...prev, email:e.target.value}))}
                    />
                    <Input
                        type="password"
                        name="password"
                        placeholder="Enter password"
                        onChange={(e)=>setUser(prev=> ({...prev, password:e.target.value}))}
                    />
                    <Button type="submit" disabled={loading}>{loading ? "Submitting...": "Sign Up"}</Button>
                    {success && success}
                    {error && error}
                </form>
            </CardContent>
            <CardFooter className="flex flex-col gap-1">
                <Link href="/login">Already have an account? Login</Link>
            </CardFooter>
        </Card>
    </div>
    )
}