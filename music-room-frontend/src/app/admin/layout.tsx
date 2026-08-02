"use client";
import AdminSideBar from "@/components/AdminSideBar";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { adminSignIn } from "@/store/slices/adminSlice";
import { changeIsLoading } from "@/store/slices/generalSlice";
import { addRoomMates, replaceRoomMate } from "@/store/slices/roomMateSlice";
import { addNewRoom, replaceRoom } from "@/store/slices/roomSlice";
import { Room, Roommates } from "@/type/prisma";
import { socket } from "@/util/socket";
import { Box, Typography } from "@mui/material";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Props {
    children : React.ReactNode
}

const AdminLayout = ( { children } : Props) => {
    const { data } = useSession();
    const admin = useAppSelector(store => store.admin.item);
    const dispatch = useAppDispatch();
    const path = usePathname();
    const router = useRouter();
    const [ isMounted , setIsMounted ] = useState(false);
    
    useEffect(() => {
        if(data && data.user && data.user.email && !admin) {
            dispatch(changeIsLoading(true))
            dispatch(adminSignIn({ email : data.user.email , onSuccess : () => {
                dispatch(changeIsLoading(false))
                if(path === "/admin") {
                    router.push("/admin/category");
                }
            } }))
        }
    } , [ data ]);

    useEffect(() => {
        if(admin) {
            const handleSocketUserJoinRoom = ({ updatedRoomMate } : {  updatedRoomMate : Roommates }) => {
                dispatch(replaceRoomMate(updatedRoomMate))
            }
            socket.on("a_user_joined_a_room" , handleSocketUserJoinRoom )

            const handleSocketCreateNewRoom = ({ newRoom , newRoomMates } : { newRoom : Room , newRoomMates : Roommates[] }) => {
                dispatch(addNewRoom(newRoom));
                dispatch(addRoomMates(newRoomMates))
            }
            socket.on("created_new_room" , handleSocketCreateNewRoom )

            const handleSocketUpdateRoom = ({ updatedRoom } : { updatedRoom : Room }) => {
                dispatch(replaceRoom(updatedRoom));
            }
            socket.on("update_room" , handleSocketUpdateRoom )

            const handleSocketRequestInRoom = ({ updatedRoomMate } : { updatedRoomMate : Roommates }) => {
                dispatch(replaceRoomMate(updatedRoomMate));
            }
            socket.on("request_in_room_check_by_admin" , handleSocketRequestInRoom )

            const handleSocketAcceptOrRejectByOwner = ( {updatedRoom , updatedRoomMate} : {updatedRoom : Room | undefined , updatedRoomMate : Roommates }) => {
                if(updatedRoom) dispatch(replaceRoom(updatedRoom))
                dispatch(replaceRoomMate(updatedRoomMate));
            }
            socket.on("accpet_or_reject_by_owner_check_by_admin" , handleSocketAcceptOrRejectByOwner )

            console.log("In")
            return () => {
                socket.off("a_user_joined_a_room" , handleSocketUserJoinRoom)
                socket.off("created_new_room" , handleSocketCreateNewRoom )
                socket.off("update_room" , handleSocketUpdateRoom )
                socket.off("request_in_room_check_by_admin" , handleSocketRequestInRoom )
                socket.off("accpet_or_reject_by_owner_check_by_admin" , handleSocketAcceptOrRejectByOwner )
                

                console.log("out")
            }
        }
    } , [ admin ])

    useEffect(() => {
        setIsMounted(true)
    } , [])

    if(!isMounted) return null;

    if(!data && !admin && path !== "/admin" ) 
    return (
        <Box sx={{ bgcolor : "primary.light" , height : "calc(100vh - 7px)" , p : "30px"}}>
            <Typography variant="h4" sx={{ textAlign : "center" }} >You are in the wrong danger zone ( friend zone ! )</Typography>
            <Typography variant="h4" sx={{ textAlign : "center" , mt : "50px" }} >Love You</Typography>
            {/* <Typography variant="h5" sx={{ textAlign : "center" , mt : "50px" }} >Please, go back to the main page to sign in.</Typography> */}
            <Link href={"/admin"} ><Typography variant="h5" sx={{ textAlign : "center" , mt : "50px" , fontStyle : "italic" , textDecoration : "underline" }}>Admin Page here!</Typography></Link>
        </Box>
    )
    else
    return (
        <Box sx={{ display : "flex" , width : "100vw" }}>
            {path !== "/admin" && <AdminSideBar />}
            <Box sx={{ p : (path !== "/admin" ?  "5px 5px 5px 0px" : ""), height : "100vh"}}>
                {children}
            </Box>
        </Box>
    )
}

export default AdminLayout;