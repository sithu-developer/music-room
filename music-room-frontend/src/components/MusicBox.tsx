"use client";

import { Box, IconButton, Slider, Typography } from "@mui/material";
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import { Music } from "@/type/prisma";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { WarnningItemType } from "@/type/warnning";
import { formatMusicTime } from "@/util/general";
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

interface Props {
    music : Music;
    setWarnningItem : ( value : WarnningItemType) => void;
    currentPlayingMusicId : number;
    setCurrentPlayingMusicId : ( value : number ) => void;
}

const MusicBox = ( { music , setWarnningItem , currentPlayingMusicId , setCurrentPlayingMusicId } : Props ) => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [ currentMusicTime , setCurrentMusicTime ] = useState<number>(0);
    const [ musicDuration , setMusicDuration ] = useState<number>(0);
    const [ isPlayingMusic , setIsPlayingMusic ] = useState<boolean>(false);

    useEffect(() => {
        if(currentPlayingMusicId !== music.id) {
            if(isPlayingMusic) {
                audioRef.current?.pause();
                setIsPlayingMusic(false)
            }
        }
    } , [currentPlayingMusicId , music.id , isPlayingMusic])

    const handleChangeMusicTime = (v : number) => {
        if(audioRef.current) {
            audioRef.current.currentTime = v;
        }
        setCurrentMusicTime(v);
    }

    const handelPlayOrPause = () => {
        if(isPlayingMusic) {
            audioRef.current?.pause()
            setCurrentPlayingMusicId(0)
        } else {
            setCurrentPlayingMusicId(music.id)
            audioRef.current?.play().catch(console.error);
        }
        setIsPlayingMusic(prev => !prev)
    }

    return (

        <Box sx={{ position : "relative" , bgcolor : "primary.dark" , borderRadius : "5px" , width : "250px" , display : "flex" , flexDirection : "column" , alignItems : "center" , p : "5px 15px" }}>
            <audio 
                ref={audioRef} 
                src={music.musicUrl} 
                onLoadedMetadata={() => {
                    if (audioRef.current) {
                        const duration = audioRef.current.duration;
                        if (!isNaN(duration) && isFinite(duration)) {
                            setMusicDuration(duration);
                        }
                    }
                    setIsPlayingMusic(false)
                }}
                onTimeUpdate={() => setCurrentMusicTime(audioRef.current ? audioRef.current.currentTime : 0)}
                onEnded={() => setIsPlayingMusic(false)}
            />
            <Box sx={{ width : "100%" ,  py : "5px" , display : "flex" , gap : "10px" }}>
                {music.musicImgUrl && (
                    <Box sx={{ width : "46px" , height : "46px" , overflow : "hidden" , display : 'flex' , justifyContent : "center" , alignItems : "center" , borderRadius : "3px" }} >
                        <Image alt="Music Image" src={music.musicImgUrl} width={100} height={100} style={{ width : "100%" , height : "auto"}} />
                    </Box>
                )}
                <Box sx={{ overflow : "hidden" , width : (music.musicImgUrl ? "155px" : "100%" )}}>
                    <Typography sx={{ fontSize : "19px"   , whiteSpace : "nowrap" ,"& span": {  display : "inline-block" , paddingLeft : (isPlayingMusic ? "100%" : "0") , "--translate-mid" : (music.musicImgUrl ? "-160px" : "-219px") , animation : (isPlayingMusic ? "marquee 8s linear infinite" : "")}  , "@keyframes marquee" : { "0%" : { transform : "translate(0 , 0)" }, "40%,60%" : { transform : `translate(var(--translate-mid) , 0)` } ,  "100%" : { transform : `translate(-110% , 0)` } }  }} ><span>{music.name}</span></Typography>
                    <Typography sx={{ fontSize : "12px"  }}>{music.artist}</Typography>
                </Box>
            </Box>
            <Box sx={{ width : "100%"}}>
                <Typography sx={{ fontSize : "11px" , textAlign : "end"  , lineHeight : "3px" }}>{formatMusicTime(currentMusicTime) + " / " + formatMusicTime(musicDuration)}</Typography>
                <Slider size="small" color="secondary" value={currentMusicTime} max={musicDuration || 100} onChange={(e , v) => handleChangeMusicTime(v)} />
            </Box>
            <Box sx={{ width : "100%" , display : "flex" , justifyContent : "center"}}>
                <IconButton onClick={handelPlayOrPause} >
                    {isPlayingMusic ? <PauseIcon sx={{ color : "secondary.main"}} /> 
                    : <PlayArrowIcon  sx={{ color : "secondary.main"}}  />}
                </IconButton>
            </Box>
            
            <IconButton onClick={() => setWarnningItem({ open : true , musicToDelete : music })} sx={{ bgcolor : "primary.main" , p : "4px" , position : "absolute" , top : "-10px" , right : "-10px" , border : "3px solid", borderColor : "primary.light" , ":hover" : { bgcolor : "primary.dark" } }}>
                <DeleteOutlineRoundedIcon sx={{ color : "whitesmoke"}} />
            </IconButton>
        </Box>
    )
}


export default MusicBox;