"use client"

import UserSideBar from "@/components/UserSideBar"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { changeIsLoading } from "@/store/slices/generalSlice"
import { userSignIn } from "@/store/slices/userSlice"
import { Box, Typography } from "@mui/material"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { useParams, usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"

interface Props {
    children : React.ReactNode
}

const UserLayout = ({ children } : Props ) => {
    const { data : session } = useSession();
    const user = useAppSelector(store => store.user.item);
    const roomMates = useAppSelector(store => store.roomMate.items);
    const path = usePathname();
    const { id } = useParams();
    const dispatch = useAppDispatch();
    const router = useRouter();
    const showSideBar = (path !== "/user" && !id )

    useEffect(() => {
        if( session && session.user && session.user.email && session.user.name && !user ) {
            dispatch(changeIsLoading(true))
            dispatch(userSignIn({ email : session.user.email , name : session.user.name , url : (session.user.image ? session.user.image : "") , onSuccess : () => {
                dispatch(changeIsLoading(false))
                if(path === "/user") {
                    router.push("/user/rooms")
                }
            } }))
        }
    } , [ session ])

    useEffect(() => {
        if(roomMates.length && user && !id) {
            const isAlreadyRoomMate = roomMates.find(item => item.userId === user.id);
            if(isAlreadyRoomMate) {
                router.push(`/user/rooms/${isAlreadyRoomMate.roomId}`)
            }
        }
    } , [ roomMates , user ])

    if(!session && !user && path !== "/user" )
    return (
        <Box sx={{ bgcolor : "primary.light" , height : "calc(100vh - 7px)" , p : "30px"}}>
            <Typography variant="h4" sx={{ textAlign : "center" }} >You are in the wrong danger zone ( friend zone ! )</Typography>
            <Typography variant="h4" sx={{ textAlign : "center" , mt : "50px" }} >Love You</Typography>
            <Link href={"/user"} ><Typography variant="h5" sx={{ textAlign : "center" , mt : "50px" , fontStyle : "italic" , textDecoration : "underline" }}>User Sign Up Page here!</Typography></Link>
        </Box>
    )
    else 
    return (
        <Box >
            {showSideBar && <UserSideBar />}
            {children}
        </Box>
    )

}

export default UserLayout;