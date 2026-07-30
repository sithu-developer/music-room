"use client"
import PlayMusic from "@/components/PlayMusic";
import RoomImageSlide from "@/components/RoomImageSlide";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { changeSnackBarItems } from "@/store/slices/generalSlice";
import { ExtraImage, Music, Room, RoomImage, Roommates } from "@/type/prisma";
import { Box, IconButton, Typography } from "@mui/material";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ImagesearchRollerRoundedIcon from '@mui/icons-material/ImagesearchRollerRounded';
import MusicNoteRoundedIcon from '@mui/icons-material/MusicNoteRounded';
import NotificationsActiveRoundedIcon from '@mui/icons-material/NotificationsActiveRounded';
import RequestsInOwner from "@/components/RequestsInOwner";
import TypographyWithWaveAnimation from "@/components/TypographyWithWaveAnimation";
import { socket } from "@/util/socket";
import { addNewRoom, replaceRoom } from "@/store/slices/roomSlice";
import { addRoomMates, replaceRoomMate } from "@/store/slices/roomMateSlice";
import Link from "next/link";
import MusicSlide from "@/components/musicSlide";

const InRoomPage = () => {
    const param = useParams();
    const roomId = Number(param.id)
    const user = useAppSelector(store => store.user.item)
    const rooms = useAppSelector(store => store.room.items);
    const roomImages = useAppSelector(store => store.roomImage.items);
    const musics = useAppSelector(store => store.music.items);
    const extraImages = useAppSelector(store => store.extraImage.items);
    const roomMates = useAppSelector(store => store.roomMate.items);
    const otherUsers = useAppSelector(store => store.user.otherUsers);
    const [ currentRoom , setCurrentRoom ] = useState<Room>();
    const [ currentRoomImage , setCurrentRoomImage ] = useState<RoomImage>();
    const [ playingMusic , setPlayingMusic ] = useState<Music>();
    const [ relatedExtraImages , setRelatedExtraImages ] = useState<ExtraImage[]>([]);
    const [ currentRoomMates , setCurrentRoomMates ] = useState<Roommates[]>([]);
    const [ myRoomMateRole , setMyRoomMateRole ] = useState<Roommates | null>(null);
    const [ openedSlideName , setOpenedSlideName  ] = useState<string>("");
    const dispatch = useAppDispatch();
    const router = useRouter();

    useEffect(() => {
        if(rooms.length && roomImages.length && musics.length && roomMates.length && roomId) {
            const foundRoom = rooms.find(item => item.id === roomId);
            setCurrentRoom(foundRoom);
            if(foundRoom) {
                const foundRoomImage = roomImages.find(item => item.id === foundRoom.currentRoomImageId);
                setCurrentRoomImage(foundRoomImage);
                const foundMusic = musics.find(item => item.id === foundRoom.playingMusicId);
                setPlayingMusic(foundMusic);
                const foundRoomMates = roomMates.filter(item => item.roomId === foundRoom.id);
                setCurrentRoomMates(foundRoomMates);
            }
        }
    } , [rooms , roomId , roomImages , musics , roomMates])

    useEffect(() => {
        if(currentRoomImage && extraImages) {
            const foundExtraImages = extraImages.filter(item => item.roomImageId === currentRoomImage.id )
            setRelatedExtraImages(foundExtraImages)
        }
    } , [ currentRoomImage , extraImages ])

    useEffect(() => {
        if(currentRoomMates.length && user && currentRoom) {
            const foundRoomMateRole = currentRoomMates.find(item => item.userId === user.id);
            if(foundRoomMateRole) {
                setMyRoomMateRole(foundRoomMateRole)

                // join room in socket and others
                socket.emit("join_room" , { roomId : foundRoomMateRole.roomId });

                // recieve updated room by roommates from owner changed room image
                const handleSocketUpdateRoom = ({ updatedRoom , isMusicChanged } : { updatedRoom : Room , isMusicChanged : boolean }) => {
                    if(updatedRoom.ownerUserId !== user.id) {
                        dispatch(replaceRoom(updatedRoom));
                        dispatch(changeSnackBarItems({ open : true , message : `Owner changed the ${isMusicChanged ? "music" : "Room Image"} !` , severity : "success" }))
                    }
                }
                socket.on("update_room" , handleSocketUpdateRoom )

                // request to owner from roommate
                const handleSocketRequestToOwner = ({ updatedRoomMate } : { updatedRoomMate : Roommates }) => {
                    if(currentRoom.ownerUserId === user.id) {
                        const requestedUser = otherUsers.find(oU => oU.id === updatedRoomMate.userId)
                        dispatch(replaceRoomMate(updatedRoomMate));
                        dispatch(changeSnackBarItems({ open : true , message : `${requestedUser?.name} requested you !` , severity : "info" }))
                    }
                }
                socket.on("request_to_owner" , handleSocketRequestToOwner )
                
                // accept or reject from Owner 
                const handleSocketAcceptOrRejectFromOwner = ({ updatedRoom , updatedRoomMate , isAccept , isRoomImage } : { updatedRoom : Room | undefined , updatedRoomMate : Roommates , isAccept : boolean , isRoomImage : boolean }) => {
                    if(currentRoom.ownerUserId !== user.id) {
                        if(updatedRoom) dispatch(replaceRoom(updatedRoom))
                        dispatch(replaceRoomMate(updatedRoomMate));
                        if(updatedRoomMate.userId === user.id) {
                            dispatch(changeSnackBarItems({ open : true , message : `Your request to change the ${isRoomImage ? "room image" : "music"} is ${isAccept ? "accepted" : "rejected"} !` , severity : (isAccept ? "success" : "error") }))
                        } else if(isAccept) {
                            dispatch(changeSnackBarItems({ open : true , message : `Owner changed the ${isRoomImage ? "room image" : "music"} !` , severity : "success" }))
                        }
                    }
                }
                socket.on("accept_or_reject_from_owner" , handleSocketAcceptOrRejectFromOwner )

                const handleSocketUserJoinRoom = ({ updatedRoomMate } : {  updatedRoomMate : Roommates }) => {
                    dispatch(replaceRoomMate(updatedRoomMate))
                    if(updatedRoomMate.roomId === currentRoom.id) { // to avoid showing noti to other roommates in other rooms
                        const joinedUser = otherUsers.find(oU => oU.id === updatedRoomMate.userId)
                        dispatch(changeSnackBarItems({ open : true , message : `${joinedUser?.name} joined the room !` , severity : "info" }))
                    }
                }
                socket.on("a_user_joined_a_room" , handleSocketUserJoinRoom)

                // to just know a new room is created for other roommates in other rooms
                const handleSocketCreateNewRoom = ({ newRoom , newRoomMates } : { newRoom : Room , newRoomMates : Roommates[] }) => {
                    if(newRoom.ownerUserId !== user.id) {
                        dispatch(addNewRoom(newRoom));
                        dispatch(addRoomMates(newRoomMates))
                    }
                }
                socket.on("created_new_room" , handleSocketCreateNewRoom )
                
                console.log("in")
                return () => {
                    socket.off("update_room" , handleSocketUpdateRoom);
                    socket.off("request_to_owner" , handleSocketRequestToOwner);
                    socket.off("accept_or_reject_from_owner" , handleSocketAcceptOrRejectFromOwner )
                    socket.off("a_user_joined_a_room" , handleSocketUserJoinRoom)
                    socket.off("created_new_room" , handleSocketCreateNewRoom )
                    socket.emit("leave_room" , { roomId : foundRoomMateRole.roomId })
                    console.log("out")
                }

            } else {
                dispatch(changeSnackBarItems({ message : "You are not a member of that room !" , severity : "error" , open : true }));
                router.push("/user/rooms")
            }
        }
    } , [ user , currentRoomMates , currentRoom , otherUsers ] )

    if(!user || !currentRoom || !currentRoomImage || !playingMusic || !currentRoomMates.length || !myRoomMateRole ) return (
        <Box sx={{ bgcolor : "primary.light" , height : "calc(100vh - 7px)" , p : "30px"}}>
            <Typography sx={{ textAlign : "center" }} >May be you are joining the room that doesn't exit !</Typography>
            <Link href={"/user/rooms"} ><Typography sx={{ textAlign : "center" , mt : "50px" , fontStyle : "italic" , textDecoration : "underline" }}>Please, click me to go to the rooms page !</Typography></Link>
        </Box>
    );


    return (
        <Box sx={{ position : "relative", height : "100vh" , background : `url(${currentRoomImage.bgImageUrl})` , backgroundSize : "cover" , backgroundPosition : "center" , backgroundRepeat : "no-repeat"  , overflow : "hidden" }} >
            <Typography sx={{ zIndex : 5 , position : "relative" , p : "21px 0 0 24px" , textAlign : "center" , fontSize : "27px" , fontWeight : "bold" , background : "linear-gradient( 45deg  , #0c0b0b , #0c0b0b, #0c0b0b , #fff , #fff , #fff)" , textShadow : "1px 1px 25px #b5b2b2" , backgroundClip : "text" , WebkitBackgroundClip : "text"  , width : "fit-content" , color : "transparent"  }} >{currentRoom.name}</Typography>
            <PlayMusic  playingMusic={playingMusic} setPlayingMusic={setPlayingMusic} currentRoom={currentRoom} />
            <Box sx={{ position : "absolute", zIndex : 5 , top : "21px" , right : "24px" , display : "flex" , gap : "15px"}} >
                {currentRoom.ownerUserId === user.id && <IconButton onClick={() => setOpenedSlideName(prev => (prev === "requestSlide" ? "" : "requestSlide"))} sx={{ position : "relative" , border : "1px solid white"}}>
                    <NotificationsActiveRoundedIcon color="secondary" />
                    {currentRoomMates.filter(item => item.requestRoomImageId || item.requestMusicId).length ? 
                    <Box sx={{ position : "absolute" , top : "2px" , right : "0px" , bgcolor : "#ff0202" , width : "8px" , height : "8px" , borderRadius : "5px"}} />
                    :undefined}
                </IconButton>}
                <IconButton sx={{  border : "1px solid white"}} 
                    onClick={() => {
                        setOpenedSlideName(prev => (prev === "roomImageSlide" ? "" : "roomImageSlide"))
                    }}
                >
                    <ImagesearchRollerRoundedIcon color="secondary" />
                </IconButton>
                <IconButton sx={{  border : "1px solid white"}} onClick={() => setOpenedSlideName(prev => (prev === "musicSlide" ? "" : "musicSlide"))} >
                    <MusicNoteRoundedIcon color="secondary" />
                </IconButton>
            </Box>
            {relatedExtraImages.length ? relatedExtraImages.map(item => (
                <Box key={item.id} sx={{ position : "absolute" , left : item.x , top : item.y}} >
                    <Image alt="Bg image" src={item.imageUrl} width={400} height={400}
                        style={{ width : item.width , height : item.height , padding : "5.5px" }}
                    />
                </Box>
            ))
            : undefined}
            <Box sx={{ zIndex : 2 , position : "absolute" , top : 0 , left : 0  }} >
                {currentRoomMates.map(item => {
                    const roomMateUser = [...otherUsers , user].find(otherUser => otherUser.id === item.userId);
                    return ( 
                    <Box key={item.id} sx={{ position : "absolute" , left : item.x , top : item.y}} >
                        <Typography sx={{ position : "absolute" , top : "-25px" , right : "50%" , zIndex : 10 , transform : "translateX(50%)" , textWrap : "nowrap"  }}>{roomMateUser ? ( roomMateUser.id === user.id ? "You" : roomMateUser.name ) : "Roommate"}</Typography>
                        <Image alt="Room Mate" src={roomMateUser ? roomMateUser.url : "/roomMate.jpg"} width={400} height={400}
                            style={{ width : item.width , height : item.height , padding : "5.5px" }}
                        />
                    </Box>
                )
                })}
            </Box>
            <Box sx={{ position : "absolute" , bottom : "0px" , right : "0px" , p : "20px" , display : "flex" , flexDirection : "column" , gap : "10px" }}>
                {myRoomMateRole.requestRoomImageId && <TypographyWithWaveAnimation text={("You are requesting the owner to set background Image (" + roomImages.find(roomImg => roomImg.id === myRoomMateRole.requestRoomImageId)?.vite + ") .....")} />}
                {myRoomMateRole.requestMusicId && <TypographyWithWaveAnimation text={("You are requesting the owner to change the music (" + musics.find(eachMusic => eachMusic.id === myRoomMateRole.requestMusicId)?.name + ") .....")} />}
            </Box>
            {currentRoom.ownerUserId === user.id && <RequestsInOwner openedSlideName={openedSlideName} currentRoomMates={currentRoomMates} />}
            <RoomImageSlide currentRoomImage={currentRoomImage} setCurrentRoomImage={setCurrentRoomImage} openedSlideName={openedSlideName} setOpenedSlideName={setOpenedSlideName} currentRoom={currentRoom} />
            <MusicSlide openedSlideName={openedSlideName} setOpenedSlideName={setOpenedSlideName} playingMusic={playingMusic} currentRoom={currentRoom} />
        </Box>
    )

}

export default InRoomPage;