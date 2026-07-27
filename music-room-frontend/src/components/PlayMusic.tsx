import { Box, Button, Dialog, DialogContent, IconButton, Slider, Typography } from "@mui/material";
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { Music, Room } from "@/type/prisma";
import { useAppSelector } from "@/store/hooks";
import { NewRoomType } from "@/type/room";
import { formatMusicTime } from "@/util/general";
import { socket } from "@/util/socket";


interface Props {
    playingMusic : Music;
    setNewRoom ?: Dispatch<SetStateAction<NewRoomType>>
    setPlayingMusic ?: (value : Music) => void;
    currentRoom : Room
}

const PlayMusic = ({ playingMusic, setNewRoom , setPlayingMusic , currentRoom } : Props ) => {
    const [ isPlayingMusic , setIsPlayingMusic ] = useState<boolean>(false);
    const [ isMuted , setIsMuted ] = useState<boolean>(false); // here is mute
    const [ isAudioAllowed , setIsAudioAllowed ] = useState<boolean>(false);
    const musics = useAppSelector(store => store.music.items)
    const user = useAppSelector(store => store.user.item)
    const audioRef = useRef<HTMLAudioElement>(null);
    const [ currentMusicTime , setCurrentMusicTime ] = useState<number>(0);
    const [ musicDuration , setMusicDuration ] = useState<number>(0);

    useEffect(() => {
        if(user && currentRoom) {

            const handleSocketTakeMusicTimeAndIsPlaying = ({ socketId } : {socketId : string}) => {
                if(user.id === currentRoom.ownerUserId && audioRef.current) {
                    socket.emit("sent_currentMusicTime_isPlaying_to_joined_roommate" , { socketId , isPlaying : !audioRef.current.paused , currentTime : audioRef.current.currentTime })
                }
            }
            socket.on("take_currentMusicTime_isPlaying_from_owner" , handleSocketTakeMusicTimeAndIsPlaying )

            const handleSetMusicTimeAndIsPlaying = ({ currentTime , isPlaying } : { isPlaying : boolean , currentTime : number }) => {
                if(audioRef.current) {
                    audioRef.current.currentTime = currentTime;
                }
                setCurrentMusicTime(currentTime);
                if(isPlaying) {
                    audioRef.current?.play().catch(err => console.warn("Autoplay blocked until user interacts with the page:",err));
                } else {
                    audioRef.current?.pause();
                }
                setIsPlayingMusic(isPlaying);
            }
            socket.on("set_currentMusicTime_IsPlaying" , handleSetMusicTimeAndIsPlaying)
            

            const handleSocketPlayOrPauseAndCurrentTime = (data : { isPlaying : boolean , currentTime : number }) => {
                if(audioRef.current) {
                    audioRef.current.currentTime = data.currentTime;
                }
                setCurrentMusicTime(data.currentTime);
                if(data.isPlaying) {
                    audioRef.current?.play().catch(err => console.warn("Autoplay blocked until user interacts with the page:",err));
                } else {
                    audioRef.current?.pause();
                }                
                setIsPlayingMusic(data.isPlaying)
            }

            if(isAudioAllowed) {
                socket.on("play_or_pause_music_musicTime_to_roommate" , handleSocketPlayOrPauseAndCurrentTime)
            }

            return () => {
                socket.off("take_currentMusicTime_isPlaying_from_owner" , handleSocketTakeMusicTimeAndIsPlaying )
                socket.off("set_currentMusicTime_IsPlaying" , handleSetMusicTimeAndIsPlaying)
                socket.off("play_or_pause_music_musicTime_to_roommate" , handleSocketPlayOrPauseAndCurrentTime)
            }
        }
    } , [ user , currentRoom , isAudioAllowed ])

    if(!user) return null;

    const handlePreviousMusic = () => {
        const indexOfCurrentMusic = musics.findIndex(item => item.id === playingMusic.id);
        if(indexOfCurrentMusic === 0) { // if first music index
            const previousMusic = musics[musics.length - 1];
            if(setNewRoom) {
                setNewRoom((prev) => { return {...prev , playingMusic : previousMusic}})
            }
            if(setPlayingMusic) {
                setPlayingMusic(previousMusic)
            }
        } else {
            const previousMusic = musics[indexOfCurrentMusic - 1];
            if(setNewRoom) {
                setNewRoom((prev) => { return {...prev , playingMusic : previousMusic}})
            }
            if(setPlayingMusic) {
                setPlayingMusic(previousMusic)
            }
        }
    }

    const handelPlayOrPause = () => {
        if(isPlayingMusic) {
            audioRef.current?.pause()
        } else {
            audioRef.current?.play().catch(console.error);
        }
        socket.emit("play_or_pause_music_musicTime_from_owner" , { isPlaying : !isPlayingMusic , currentTime : (audioRef.current ? audioRef.current.currentTime : currentMusicTime) , roomId : currentRoom.id })
        setIsPlayingMusic(prev => !prev)  
    }

    const handleChangeMusicTime = (v : number) => {
        if(audioRef.current) {
            audioRef.current.currentTime = v;
        }
        socket.emit("play_or_pause_music_musicTime_from_owner" , { isPlaying : isPlayingMusic , currentTime : v , roomId : currentRoom.id })
        setCurrentMusicTime(v);
    }

    const handleNextMusic = () => {
        const indexOfCurrentMusic = musics.findIndex(item => item.id === playingMusic.id);
        if(indexOfCurrentMusic === (musics.length - 1)) { // if last music index
            const nextMusic = musics[0];
            if(setNewRoom) {
                setNewRoom((prev) => { return {...prev , playingMusic : nextMusic}})
            }
            if(setPlayingMusic) {
                setPlayingMusic(nextMusic)
            }
        } else {
            const nextMusic = musics[indexOfCurrentMusic + 1];
            if(setNewRoom) {
                setNewRoom((prev) => { return {...prev , playingMusic : nextMusic}})
            }
            if(setPlayingMusic) {
                setPlayingMusic(nextMusic)
            }
        }
    }
    
    return (
        <Box sx={{ position : "relative" , zIndex : 3 , p : "10px" , mt : "10px" , display : "flex" , justifyContent : "center"  }}>
            <Box sx={{ background : "rgba(101, 106, 106, 0.1)" , backdropFilter : "blur(20px)" , WebkitBackdropFilter : "blur(20px)" , borderRadius : "30px" , width : "280px" , display : "flex" , flexDirection : "column" , alignItems : "center" , p : "5px 15px" , border : "1px dashed black" }}>
                <audio 
                    ref={audioRef} 
                    src={"/testMusic.m4a"} 
                    onLoadedMetadata={() => setMusicDuration(audioRef.current ? audioRef.current.duration : 0 ) }
                    onTimeUpdate={() => setCurrentMusicTime(audioRef.current ? audioRef.current.currentTime : 0)}
                    onEnded={() => setIsPlayingMusic(false)}
                />
                <Typography sx={{ fontSize : "19px" , py : "5px" , color : "primary.dark" }} >{playingMusic.name}</Typography>
                <Box sx={{ width : "100%" , }}>
                    <Typography sx={{ fontSize : "11px" , textAlign : "end" , lineHeight : "3px" }}>{formatMusicTime(currentMusicTime) + " / " + formatMusicTime(musicDuration)}</Typography>
                    <Slider disabled={user.id !== currentRoom.ownerUserId} size="small" value={currentMusicTime} max={musicDuration || 100} sx={{ color : "primary.dark" }} onChange={(e , v) => handleChangeMusicTime(v)} />
                </Box>
                {user.id === currentRoom.ownerUserId && <Box sx={{ display : "flex" , gap : "10px"}}>
                    <IconButton onClick={handlePreviousMusic}>
                        <SkipPreviousIcon sx={{ color : "primary.dark"}} />
                    </IconButton>
                    <IconButton onClick={handelPlayOrPause} >
                        {isPlayingMusic ? <PauseIcon sx={{ color : "primary.dark"}} /> 
                        : <PlayArrowIcon  sx={{ color : "primary.dark"}}  />}
                    </IconButton>
                    <IconButton onClick={handleNextMusic}>
                        <SkipNextIcon sx={{ color : "primary.dark"}} />
                    </IconButton>
                </Box>}
            </Box>
            {user.id !== currentRoom.ownerUserId && <Dialog open={!isAudioAllowed}>
                <DialogContent sx={{ bgcolor : "primary.main" , display : "flex" , flexDirection : "column" , gap : "20px"}}>
                    <Typography>Please, allow the audio to play music and sync the music.</Typography>
                    <Button variant="outlined" color="secondary" onClick={() => {
                        if (audioRef.current) {
                            audioRef.current.play().then(() => {
                            audioRef.current?.pause();
                            setIsAudioAllowed(true);
                            socket.emit("sync_music_data" , { roomId : currentRoom.id })
                            }).catch(console.error);
                        }
                    }} >Allow</Button>
                </DialogContent>
            </Dialog>}
        </Box>
    )
}

export default PlayMusic;