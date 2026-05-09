"use client"
import { Box, Button, IconButton, Typography } from "@mui/material"
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import NewMusicDialog from "@/components/NewMusic";
import { useState } from "react";
import { useAppSelector } from "@/store/hooks";
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import UpdateMusicDialog from "@/components/UpdateMusic";
import { UpdateMusicDialogItems } from "@/type/music";
import { WarnningItemType } from "@/type/warnning";
import WarnningDialog from "@/components/Warnning";


const MusicPage = () => {
    const [ newMusicDialogOpen , setNewMusicDialogOpen ] = useState<boolean>(false);
    const [ updateMusicDialogItems , setUpdateMusicDialogItems ] = useState<UpdateMusicDialogItems | null>(null);
    const [ warnningItem , setWarnningItem ] = useState<WarnningItemType>({ open : false });
    const musics = useAppSelector(store => store.music.items);


    return (
        <Box sx={{ bgcolor : "primary.light" , width : "calc(100vw - 250px)" , height : "100vh" , p : "10px" }}>
            <Box sx={{ display : "flex" , alignItems : 'center' , justifyContent : "space-between" , px : "10px"}}>
                <span />
                <Typography sx={{ textAlign : "center" , fontSize : "30px" }} >Music</Typography>
                <IconButton sx={{ borderRadius : "11px" , border : "1px solid white"}} onClick={() => setNewMusicDialogOpen(true)} >
                    <AddRoundedIcon sx={{ color : "whitesmoke"}} />
                </IconButton>
            </Box>
            <Box sx={{ display : "flex" , flexWrap : "wrap" , gap : "10px" , p : "10px"}} >
                {musics.map(item => (
                    // <Box>
                    //     <Typography key={item.id} >{item.name}</Typography>

                    // </Box>
                    <Box key={item.id} sx={{ display : "flex" , flexDirection : 'column' , alignItems : "center" , width : "150px" , gap : "10px"}} >
                        <Box sx={{ position : "relative" , bgcolor : "primary.dark" , width : "100%" , height : "80px"  , borderRadius : "5px" , display : "flex" , justifyContent : "center" , alignItems : "center" }}>
                            <Typography>{item.name}</Typography>
                            
                            <IconButton onClick={() => setWarnningItem({ open : true , musicToDelete : item })} sx={{ bgcolor : "primary.main" , p : "4px" , position : "absolute" , top : "-10px" , right : "-10px" , border : "3px solid", borderColor : "primary.light" , ":hover" : { bgcolor : "primary.dark" } }}>
                                <DeleteOutlineRoundedIcon sx={{ color : "whitesmoke"}} />
                            </IconButton>
                        </Box>
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