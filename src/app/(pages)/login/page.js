import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/auth";
import { redirect } from "next/navigation";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import Link from "next/link"
import LoginForm from "@/components/loginForm"

export default async function Login(){
    const serverSession = await getServerSession(options)
    console.log('serverSession in login page', serverSession)
     
    return(
    <div className="naseem flex justify-center">
        <Card>
            <CardHeader>
            <CardTitle>Login</CardTitle>
            </CardHeader>
            <CardContent>
                <LoginForm/>
            </CardContent>
            <CardFooter className="flex flex-col gap-1">
                <Link href={"/signup"}>Don't have an account? Signup</Link>
            </CardFooter>
        </Card>
    </div>
    )
}