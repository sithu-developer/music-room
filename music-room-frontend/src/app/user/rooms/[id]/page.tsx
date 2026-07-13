"use client"
import PlayMusic from "@/components/PlayMusic";
import { useAppSelector } from "@/store/hooks";
import { Music, Room, RoomImage } from "@/type/prisma";
import { Box, Typography } from "@mui/material";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const InRoomPage = () => {
    const param = useParams();
    const roomId = Number(param.id)
    const rooms = useAppSelector(store => store.room.items);
    const roomImages = useAppSelector(store => store.roomImage.items);
    const musics = useAppSelector(store => store.music.items);
    const [ currentRoom , setCurrentRoom ] = useState<Room>();
    const [ currentRoomImage , setCurrentRoomImage ] = useState<RoomImage>();
    const [ playingMusic , setPlayingMusic ] = useState<Music>();

    useEffect(() => {
        if(rooms.length && roomImages.length && roomId) {
            const foundRoom = rooms.find(item => item.id === roomId);
            setCurrentRoom(foundRoom);
            if(foundRoom) {
                const foundRoomImage = roomImages.find(item => item.id === foundRoom.currentRoomImageId);
                setCurrentRoomImage(foundRoomImage);
                const foundMusic = musics.find(item => item.id === foundRoom.playingMusicId);
                setPlayingMusic(foundMusic)
            }
        }
    } , [rooms , roomId , roomImages , musics])

    if(!currentRoom || !currentRoomImage || !playingMusic) return null;


    return (
        <Box sx={{ height : "100vh" , background : `url(${currentRoomImage.bgImageUrl})` , backgroundSize : "cover" , backgroundRepeat : "no-repeat" , backgroundPosition : "center" , overflow : "hidden" }} >
            <Typography sx={{ p : "21px 0 0 24px" , userSelect : "none" , textAlign : "center" , fontSize : "27px" , fontWeight : "bold" , background : "linear-gradient( 45deg  , #0c0b0b , #0c0b0b, #0c0b0b , #fff , #fff , #fff)" , textShadow : "1px 1px 25px #b5b2b2" , backgroundClip : "text" , WebkitBackgroundClip : "text"  , width : "fit-content" , color : "transparent"  }} >{currentRoom.name}</Typography>
            <PlayMusic playingMusic={playingMusic} setPlayingMusic={setPlayingMusic} />
        </Box>
    )

}

export default InRoomPage;