"use client"
import PlayMusic from "@/components/PlayMusic";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { changeIsLoading, changeSnackBarItems } from "@/store/slices/generalSlice";
import { checkPermissionAndRoomMateUsers } from "@/store/slices/roomSlice";
import { ExtraImage, Music, Room, RoomImage, Roommates } from "@/type/prisma";
import { Box, Typography } from "@mui/material";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const InRoomPage = () => {
    const param = useParams();
    const roomId = Number(param.id)
    const user = useAppSelector(store => store.user.item)
    const rooms = useAppSelector(store => store.room.items);
    const roomImages = useAppSelector(store => store.roomImage.items);
    const musics = useAppSelector(store => store.music.items);
    const extraImages = useAppSelector(store => store.extraImage.items);
    const roomMates = useAppSelector(store => store.roomMate.items);
    const roomMateUsers = useAppSelector(store => store.room.roomMateUsers);
    const [ currentRoom , setCurrentRoom ] = useState<Room>();
    const [ currentRoomImage , setCurrentRoomImage ] = useState<RoomImage>();
    const [ playingMusic , setPlayingMusic ] = useState<Music>();
    const [ relatedExtraImages , setRelatedExtraImages ] = useState<ExtraImage[]>([]);
    const [ currentRoomMates , setCurrentRoomMates ] = useState<Roommates[]>([]);
    const [ hasPermission , setHasPermission ] = useState<boolean>(false);
    const hasFetched = useRef(false);
    const dispatch = useAppDispatch();
    const router = useRouter();



    useEffect(() => {
        if(rooms.length && roomImages.length && roomId) {
            const foundRoom = rooms.find(item => item.id === roomId);
            setCurrentRoom(foundRoom);
            if(foundRoom) {
                const foundRoomImage = roomImages.find(item => item.id === foundRoom.currentRoomImageId);
                setCurrentRoomImage(foundRoomImage);
                const foundMusic = musics.find(item => item.id === foundRoom.playingMusicId);
                setPlayingMusic(foundMusic);
                const foundRoomMates = roomMates.filter(item => item.roomId === foundRoom.id);
                setCurrentRoomMates(foundRoomMates);
                if(foundRoomImage) {
                    const foundExtraImages = extraImages.filter(item => item.roomImageId === foundRoomImage.id )
                    setRelatedExtraImages(foundExtraImages)
                }
            }
        }
    } , [rooms , roomId , roomImages , musics , extraImages , roomMates])

    useEffect(() => {
        if(!hasFetched.current && roomId && user ) {
            hasFetched.current = true;
            dispatch(changeIsLoading(true))
            dispatch(checkPermissionAndRoomMateUsers({ roomId , userId : user.id , 
                onFail : () => {
                    dispatch(changeIsLoading(false))
                    dispatch(changeSnackBarItems({ message : "You are not a member of that room !" , severity : "error" , open : true }));
                    router.push("/user/rooms")
                },
                onSuccess : () => {
                    dispatch(changeIsLoading(false))
                    setHasPermission(true)
                }
            }))
        }
    } , [ roomId , user ] )

    if(!currentRoom || !currentRoomImage || !playingMusic || !currentRoomMates.length || !hasPermission || !roomMateUsers.length) return null;


    return (
        <Box sx={{ height : "100vh" , background : `url(${currentRoomImage.bgImageUrl})` , backgroundSize : "cover" , backgroundRepeat : "no-repeat" , backgroundPosition : "center" , overflow : "hidden" }} >
            <Typography sx={{ zIndex : 5 , position : "relative" , p : "21px 0 0 24px" , textAlign : "center" , fontSize : "27px" , fontWeight : "bold" , background : "linear-gradient( 45deg  , #0c0b0b , #0c0b0b, #0c0b0b , #fff , #fff , #fff)" , textShadow : "1px 1px 25px #b5b2b2" , backgroundClip : "text" , WebkitBackgroundClip : "text"  , width : "fit-content" , color : "transparent"  }} >{currentRoom.name}</Typography>
            <PlayMusic playingMusic={playingMusic} setPlayingMusic={setPlayingMusic} />
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
                    const roomMateUser = roomMateUsers.find(rMUser => rMUser.id === item.userId);
                    return ( // customize user profile
                    <Box key={item.id} sx={{ position : "absolute" , left : item.x , top : item.y}} >
                        <Image alt="Room Mate" src={roomMateUser ? roomMateUser.url : "/roomMate.jpg"} width={400} height={400}
                            style={{ width : item.width , height : item.height , padding : "5.5px" }}
                        />
                    </Box>
                )
                })}
            </Box>
        </Box>
    )

}

export default InRoomPage;