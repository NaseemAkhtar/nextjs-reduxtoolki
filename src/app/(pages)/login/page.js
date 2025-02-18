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