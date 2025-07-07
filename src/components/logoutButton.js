
"use client"
import {LogOut } from "lucide-react"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"

  export default function LogoutButton(){
    return(
        <DropdownMenuItem onClick={()=>LogOut()} className="cursor-pointer">
            <LogOut />
            <span>Log out</span>
        </DropdownMenuItem>
    )
}