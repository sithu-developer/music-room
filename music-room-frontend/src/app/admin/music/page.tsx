"use client"
import { Box, Button, IconButton, Slider, TextField, Typography } from "@mui/material"
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import NewMusicDialog from "@/components/NewMusic";
import { useRef, useState } from "react";
import { useAppSelector } from "@/store/hooks";
import UpdateMusicDialog from "@/components/UpdateMusic";
import { UpdateMusicDialogItems } from "@/type/music";
import { WarnningItemType } from "@/type/warnning";
import WarnningDialog from "@/components/Warnning";
import Image from "next/image";
import MusicBox from "@/components/MusicBox";


const MusicPage = () => {
    const [ newMusicDialogOpen , setNewMusicDialogOpen ] = useState<boolean>(false);
    const [ updateMusicDialogItems , setUpdateMusicDialogItems ] = useState<UpdateMusicDialogItems | null>(null);
    const [ warnningItem , setWarnningItem ] = useState<WarnningItemType>({ open : false });
    const musics = useAppSelector(store => store.music.items);
    const [ currentPlayingMusicId , setCurrentPlayingMusicId ] = useState<number>(0);
    const [ searchName , setSearchName ] = useState<string>("");


    return (
        <Box sx={{ bgcolor : "primary.light" , width : "calc(100vw - 250px)" , height : "100%" , p : "10px" , borderRadius : "7px" }}>
            <Box sx={{ display : "flex" , alignItems : 'center' , justifyContent : "space-between" , px : "10px"}}>
                <Box sx={{ width : "10px"  , pl : "15px"}}>
                    <TextField value={searchName} variant="standard" color="secondary" placeholder="Search..." sx={{ width : "200px" }} onChange={e => setSearchName(e.target.value)} />
                </Box>
                <Typography sx={{ textAlign : "center" , fontSize : "30px" }} >Music</Typography>
                <IconButton sx={{ borderRadius : "11px" , border : "1px solid white"}} onClick={() => setNewMusicDialogOpen(true)} >
                    <AddRoundedIcon sx={{ color : "whitesmoke"}} />
                </IconButton>
            </Box>
            <Box sx={{ display : "flex" , alignContent : "start"  , flexWrap : "wrap" , gap : "20px" , overflowY : "auto", height : "calc(100vh - 95px)" , p : "10px 20px" , mt : "10px" }} >
                {musics.filter(item => searchName ? item.name.toLowerCase().includes(searchName.toLowerCase()): true).map(item => (
                    <Box key={item.id} sx={{ display : "flex" , flexDirection : 'column' , alignItems : "center" , gap : "10px"}} >
                        <MusicBox music={item} setWarnningItem={setWarnningItem} currentPlayingMusicId={currentPlayingMusicId} setCurrentPlayingMusicId={setCurrentPlayingMusicId} />
                        <Button variant="contained" sx={{ width : "100%"}} onClick={() => setUpdateMusicDialogItems({ open : true , selectedMusic : item })} >Update</Button>
                    </Box>
                ))}
            </Box>
            <NewMusicDialog open={newMusicDialogOpen} setOpen={setNewMusicDialogOpen} />
            {updateMusicDialogItems && <UpdateMusicDialog setUpdateMusicDialogItems={setUpdateMusicDialogItems} updateMusicDialogItems={updateMusicDialogItems} />}
            <WarnningDialog setWarnningItem={setWarnningItem} warnningItem={warnningItem} />
        </Box>
    )
}

export default MusicPage;

// sx={{
//   backgroundColor: '#e0f2fe', 
//   backgroundImage: 
//     radial-gradient(at 0% 0%, hsla(253,16%,7%,1) 0, transparent 50%), 
//     radial-gradient(at 50% 0%, hsla(225,39%,30%,1) 0, transparent 50%), 
//     radial-gradient(at 100% 0%, hsla(339,49%,30%,1) 0, transparent 50%),
//     radial-gradient(at 29% 100%, hsla(339,49%,30%,1) 0, transparent 50%),
//     radial-gradient(at 0% 100%, hsla(253,16%,7%,1) 0, transparent 50%),
//     radial-gradient(at 80% 100%, hsla(242,100%,70%,1) 0, transparent 50%),
//     radial-gradient(at 0% 50%, hsla(343,100%,76%,1) 0, transparent 50%)
//   ,
//   backgroundSize: '100% 100%',
//   backgroundRepeat: 'no-repeat',
// }}


// sx={{ width : "100vw" , height : "100vh" , p : "10px" , backgroundColor: '#e0f2fe',  backgroundSize: '100% 100%', backgroundRepeat: 'no-repeat',
//              backgroundImage: `
//                 radial-gradient(at 0% 0%, rgb(26, 170, 202) 0, transparent 50%), 
//                 radial-gradient(at 50% 0%, rgb(240, 247, 190) 0, transparent 50%), 
//                 radial-gradient(at 100% 0%, rgb(231, 164, 187) 0, transparent 50%),
//                 radial-gradient(at 29% 100%, rgb(217, 198, 252) 0, transparent 50%),
//                 radial-gradient(at 0% 100%, rgb(223, 233, 162) 0, transparent 50%),
//                 radial-gradient(at 80% 100%, rgb(227, 102, 255) 0, transparent 50%),
//                 radial-gradient(at 0% 50%, rgb(237, 188, 243) 0, transparent 50%)`
//             ,
//             WebkitBackgroundSize: "200% 200%",
//             animation: 'swirlMove 10s ease-in-out infinite alternate', 
//             '@keyframes swirlMove': {
//                 '0%': { 
//                 backgroundPosition: '0% 0%' 
//                 },
//                 '25%': { 
//                 backgroundPosition: '100% 0%' 
//                 },
//                 '50%': { 
//                 backgroundPosition: '100% 100%' 
//                 },
//                 '75%': { 
//                 backgroundPosition: '0% 100%' 
//                 },
//                 '100%': { 
//                 backgroundPosition: '0% 0%' 
//                 }
//             },

//          }}