import { Box, IconButton, Slider, Typography } from "@mui/material";
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { Dispatch, SetStateAction, useState } from "react";
import { Music } from "@/type/prisma";
import { useAppSelector } from "@/store/hooks";
import { NewRoomType } from "@/type/room";


interface Props {
    playingMusic : Music;
    setNewRoom ?: Dispatch<SetStateAction<NewRoomType>>
}

const PlayMusic = ({ playingMusic, setNewRoom } : Props ) => {
    const [ isPlayingMusic , setIsPlayingMusic ] = useState<boolean>(false);
    const musics = useAppSelector(store => store.music.items)


    const handlePreviousMusic = () => {
        const indexOfCurrentMusic = musics.findIndex(item => item.id === playingMusic.id);
        if(indexOfCurrentMusic === 0) { // if first music index
            const previousMusic = musics[musics.length - 1];
            if(setNewRoom) {
                setNewRoom((prev) => { return {...prev , playingMusic : previousMusic}})
            }
        } else {
            const previousMusic = musics[indexOfCurrentMusic - 1];
            if(setNewRoom) {
                setNewRoom((prev) => { return {...prev , playingMusic : previousMusic}})
            }
        }
    }

    const handleNextMusic = () => {
        const indexOfCurrentMusic = musics.findIndex(item => item.id === playingMusic.id);
        if(indexOfCurrentMusic === (musics.length - 1)) { // if last music index
            const nextMusic = musics[0];
            if(setNewRoom) {
                setNewRoom((prev) => { return {...prev , playingMusic : nextMusic}})
            }
        } else {
            const nextMusic = musics[indexOfCurrentMusic + 1];
            if(setNewRoom) {
                setNewRoom((prev) => { return {...prev , playingMusic : nextMusic}})
            }
        }
    }
    
    return (
        <Box sx={{ p : "10px" , mt : "10px" , display : "flex" , justifyContent : "center" , position : "relative" , zIndex : 3 }}>
            <Box sx={{ background : "rgba(101, 106, 106, 0.1)" , backdropFilter : "blur(20px)" , WebkitBackdropFilter : "blur(20px)" , borderRadius : "30px" , width : "250px" , display : "flex" , flexDirection : "column" , alignItems : "center" , p : "5px 15px" , border : "1px dashed black" }}>
                <Typography sx={{ fontSize : "19px" , py : "5px" , color : "primary.dark" }} >{playingMusic.name}</Typography>
                <Slider size="small" valueLabelDisplay="auto" sx={{ color : "primary.dark"}}  />
                <Box sx={{ display : "flex" , gap : "10px"}}>
                    <IconButton onClick={handlePreviousMusic}>
                        <SkipPreviousIcon sx={{ color : "primary.dark"}} />
                    </IconButton>
                    <IconButton onClick={() => setIsPlayingMusic(!isPlayingMusic)}>
                        {isPlayingMusic ? <PauseIcon sx={{ color : "primary.dark"}} /> 
                        : <PlayArrowIcon  sx={{ color : "primary.dark"}}  />}
                    </IconButton>
                    <IconButton onClick={handleNextMusic}>
                        <SkipNextIcon sx={{ color : "primary.dark"}} />
                    </IconButton>
                </Box>
            </Box>
        </Box>
    )
}

export default PlayMusic;