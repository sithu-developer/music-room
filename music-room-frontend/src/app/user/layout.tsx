"use client"

import UserSideBar from "@/components/UserSideBar"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { changeIsLoading, changeSnackBarItems } from "@/store/slices/generalSlice"
import { userSignIn } from "@/store/slices/userSlice"
import { Box, Typography } from "@mui/material"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { useParams, usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"
import { socket } from "@/util/socket";
import { addRoomMates, replaceRoomMate } from "@/store/slices/roomMateSlice"
import { ExtraImage, Music, Room, RoomImage, Roommates } from "@/type/prisma"
import { addNewRoom, replaceRoom } from "@/store/slices/roomSlice"
import { addMusic, removeMusic, replaceMusic } from "@/store/slices/musicSlice"
import { addRoomImage } from "@/store/slices/roomImageSlice"
import { addExtraImages } from "@/store/slices/extraImagesSlice"

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
    } , [ roomMates , user , path ])

    useEffect(() => {
        if(user ) {
            const handleSocketUserJoinRoom = ({ updatedRoomMate } : {  updatedRoomMate : Roommates }) => {
                dispatch(replaceRoomMate(updatedRoomMate))
            }
            const handleSocketCreateNewRoom = ({ newRoom , newRoomMates } : { newRoom : Room , newRoomMates : Roommates[] }) => {
                if(newRoom.ownerUserId !== user.id) {
                    dispatch(addNewRoom(newRoom));
                    dispatch(addRoomMates(newRoomMates))
                }
            }
            // changes in room 
            const handleSocketUpdateRoom = ({ updatedRoom } : { updatedRoom : Room }) => {
                if(updatedRoom.ownerUserId !== user.id) {
                    dispatch(replaceRoom(updatedRoom));
                }
            }
            const handleSocketAcceptOrRejectFromOwner = ({ updatedRoom } : { updatedRoom : Room | undefined }) => {
                if(updatedRoom && updatedRoom.ownerUserId !== user.id) {
                    dispatch(replaceRoom(updatedRoom))
                }
            }
            if(!id) {
                socket.on("a_user_joined_a_room" , handleSocketUserJoinRoom )
                socket.on("created_new_room" , handleSocketCreateNewRoom )
                socket.on("update_room" , handleSocketUpdateRoom )
                socket.on("accept_or_reject_by_owner_check_from_outside_and_other_rooms" , handleSocketAcceptOrRejectFromOwner )
            }

            // CRUD music and room images
            const handleSocketNewMusicCreated  = ({ newMusic } : { newMusic : Music }) => {
                if(newMusic.userId !== user.id) {
                    dispatch(addMusic(newMusic))
                }
            }
            socket.on("created_new_music" , handleSocketNewMusicCreated )

            const handleSocketMusicUpdated  = ({ updatedMusic } : { updatedMusic : Music }) => {
                if(updatedMusic.userId !== user.id) {
                    dispatch(replaceMusic(updatedMusic))
                    dispatch(changeSnackBarItems({ open : true , message : `Admin updated the music (${updatedMusic.name})` , severity : "info"  }))
                }
            }
            socket.on("update_music" , handleSocketMusicUpdated);

            const handleSocketMusicDeleted  = ( { deletedMusic } : { deletedMusic : Music }) => {
                if(deletedMusic.userId !== user.id) {
                    dispatch(removeMusic(deletedMusic.id))
                    dispatch(changeSnackBarItems({ open : true , message : `Admin deleted the music (${deletedMusic.name})` , severity : "info"  }))
                }
            }
            socket.on("delete_music" , handleSocketMusicDeleted)

            const handleSocketNewRoomImageCreated  = ({ newRoomImage , newExtraImages } : { newRoomImage : RoomImage , newExtraImages : ExtraImage[] }) => {
                if(newRoomImage.userId !== user.id) {
                    dispatch(addRoomImage(newRoomImage))
                    dispatch(addExtraImages(newExtraImages))
                }
            }
            socket.on("new_roomImage_created" , handleSocketNewRoomImageCreated )
            
            console.log("in")
            return () => {
                socket.off("a_user_joined_a_room" , handleSocketUserJoinRoom)
                socket.off("created_new_room" , handleSocketCreateNewRoom )
                socket.off("update_room" , handleSocketUpdateRoom )
                socket.off("accept_or_reject_by_owner_check_from_outside_and_other_rooms" , handleSocketAcceptOrRejectFromOwner )
                socket.off("created_new_music" , handleSocketNewMusicCreated )
                socket.off("update_music" , handleSocketMusicUpdated);
                socket.off("delete_music" , handleSocketMusicDeleted)
                socket.off("new_roomImage_created" , handleSocketNewRoomImageCreated )
                console.log("out")
            }
        }
    } , [user ])

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