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
import RequestTextBox from "@/components/RequestTextBox";

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
    const [ updateRoomImageOpen , setUpdateRoomImageOpen ] = useState<boolean>(false);
    const [ isMineRoomImages , setIsMineRoomImages ] = useState(false);
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
        if(currentRoomMates.length && user) {
            const foundRoomMateRole = currentRoomMates.find(item => item.userId === user.id);
            if(foundRoomMateRole) {
                setMyRoomMateRole(foundRoomMateRole)
            } else {
                dispatch(changeSnackBarItems({ message : "You are not a member of that room !" , severity : "error" , open : true }));
                router.push("/user/rooms")
            }
        }
    } , [ user , currentRoomMates ] )

    if(!user || !currentRoom || !currentRoomImage || !playingMusic || !currentRoomMates.length || !myRoomMateRole ) return null;


    return (
        <Box sx={{ position : "relative", height : "100vh" , background : `url(${currentRoomImage.bgImageUrl})` , backgroundSize : "cover" , backgroundPosition : "center" , backgroundRepeat : "no-repeat"  , overflow : "hidden" }} >
            <Typography sx={{ zIndex : 5 , position : "relative" , p : "21px 0 0 24px" , textAlign : "center" , fontSize : "27px" , fontWeight : "bold" , background : "linear-gradient( 45deg  , #0c0b0b , #0c0b0b, #0c0b0b , #fff , #fff , #fff)" , textShadow : "1px 1px 25px #b5b2b2" , backgroundClip : "text" , WebkitBackgroundClip : "text"  , width : "fit-content" , color : "transparent"  }} >{currentRoom.name}</Typography>
            <PlayMusic playingMusic={playingMusic} setPlayingMusic={setPlayingMusic} />
            <Box sx={{ position : "absolute", zIndex : 5 , top : "21px" , right : "24px" , display : "flex" , gap : "20px"}} >
                <IconButton sx={{  border : "1px solid white"}} 
                    onClick={() => {
                        setUpdateRoomImageOpen(prev => (!prev))
                        const foundRoomImage = roomImages.find(item => item.id === currentRoom.currentRoomImageId);
                        setCurrentRoomImage(foundRoomImage);
                        setIsMineRoomImages(false)
                    }}
                >
                    <ImagesearchRollerRoundedIcon color="secondary" />
                </IconButton>
                <IconButton sx={{  border : "1px solid white"}}>
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
                        <Typography sx={{ position : "absolute" , top : "-25px" , right : "50%" , zIndex : 10 , transform : "translateX(50%)" , textWrap : "nowrap"  }}>{roomMateUser ? ( roomMateUser.id === user.id ? "You" : roomMateUser.name ) : ""}</Typography>
                        <Image alt="Room Mate" src={roomMateUser ? roomMateUser.url : "/roomMate.jpg"} width={400} height={400}
                            style={{ width : item.width , height : item.height , padding : "5.5px" }}
                        />
                    </Box>
                )
                })}
            </Box>
            <RequestTextBox myRoomMateRole={myRoomMateRole} />
            <RoomImageSlide currentRoomImage={currentRoomImage} setCurrentRoomImage={setCurrentRoomImage} updateRoomImageOpen={updateRoomImageOpen} setUpdateRoomImageOpen={setUpdateRoomImageOpen} currentRoom={currentRoom} isMineRoomImages={isMineRoomImages} setIsMineRoomImages={setIsMineRoomImages} />
        </Box>
    )

}

export default InRoomPage;