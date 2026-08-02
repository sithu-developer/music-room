"use client"
import { Box, Button, Chip, Dialog, DialogContent, TextField, Typography } from "@mui/material"
import MusicNoteRoundedIcon from '@mui/icons-material/MusicNoteRounded';
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { UpdateMusicDialogItems } from "@/type/music";
import { useAppDispatch } from "@/store/hooks";
import { updateMusic } from "@/store/slices/musicSlice";
import { changeIsLoading, changeSnackBarItems } from "@/store/slices/generalSlice";
import LandscapeRoundedIcon from '@mui/icons-material/LandscapeRounded';


interface Props {
    updateMusicDialogItems : UpdateMusicDialogItems;
    setUpdateMusicDialogItems : ( value : UpdateMusicDialogItems | null ) => void
}

const UpdateMusicDialog = ( { updateMusicDialogItems , setUpdateMusicDialogItems } : Props ) => {
    const [ musicFileToUpdate , setMusicFileToUpdate ] = useState<File | null>(null);
    const [ musicImgFileToUpdate , setMusicImgFileToUpdate ] = useState<File | null>(null);
    const dispatch = useAppDispatch();

    const onMusicDrop = useCallback((backgroundImages : File[]) => {
        const music = backgroundImages[0];
        if(!music) return;
        if (!music.type.startsWith("audio/")) {
            alert("Please select an music file");
            return;
        }
        setMusicFileToUpdate(music)
    }, [])

    const musicDropItems = useDropzone({onDrop : onMusicDrop });

     const onImgMusicDrop = useCallback((backgroundImages : File[]) => {
        const musicImage = backgroundImages[0];
        if(!musicImage) return;
        if (!musicImage.type.startsWith("image/")) {
            alert("Please select an image file");
            return;
        }
        setMusicImgFileToUpdate(musicImage)
    }, [])

    const musicImgDropItems = useDropzone({onDrop : onImgMusicDrop });

    const handleUpdateMusic = () => {
        dispatch(changeIsLoading(true));
        if(musicFileToUpdate || musicImgFileToUpdate) {
            // upload music or image or both
            dispatch(updateMusic({...updateMusicDialogItems.selectedMusic , musicUrl : "/The Script.mp3" , musicImgUrl : "/roomMate.jpg" , onSuccess : () => {
                setUpdateMusicDialogItems(null);
                setMusicFileToUpdate(null);
                dispatch(changeIsLoading(false));
                dispatch(changeSnackBarItems({ open : true , message : "Music updated !" , severity : "success" }))
            } }));
        } else {
            dispatch(updateMusic({...updateMusicDialogItems.selectedMusic , onSuccess : () => {
                setUpdateMusicDialogItems(null);
                setMusicFileToUpdate(null);
                dispatch(changeIsLoading(false));
                dispatch(changeSnackBarItems({ open : true , message : "Music updated !" , severity : "success" }))
            } }))
        }
    }

    return (
        <Dialog open={updateMusicDialogItems.open} onClose={() => {
            setUpdateMusicDialogItems(null);
            setMusicFileToUpdate(null);
        }} >
            <DialogContent sx={{ background : "linear-gradient(135deg, #28c3d1 , #1a5381 , #1eb2cc , #2091ee)" , display : "flex" , flexDirection : "column" , gap : "20px" }}>
                <Typography  sx={{ fontSize : "20px"}} >Update Music</Typography>
                <TextField color="secondary" sx={{ input : { color : "white" }}} variant="outlined" label="Name *" value={updateMusicDialogItems.selectedMusic.name} onChange={(e) => setUpdateMusicDialogItems({...updateMusicDialogItems , selectedMusic : { ...updateMusicDialogItems.selectedMusic , name : e.target.value } }) }  />
                <TextField label="Artist (Optional)" color="secondary" sx={{ input : { color : "white" }}} value={updateMusicDialogItems.selectedMusic.artist} onChange={(e) => setUpdateMusicDialogItems({...updateMusicDialogItems , selectedMusic : { ...updateMusicDialogItems.selectedMusic , artist : e.target.value } }) }  />                                                                                                                  
                <Box sx={{ display : "flex" , flexDirection :"column" , gap : "5px" , alignItems : "start" }}>
                    <Button {...musicImgDropItems.getRootProps()}  variant="outlined" sx={{ width : "100%" , borderRadius : "25px" , color : "white" , borderColor : "primary.main" , textTransform : "none" , py : "12px" , display : 'flex' , justifyContent : "space-between"}} >
                        <input {...musicImgDropItems.getInputProps()} accept="image/*" />
                        <Typography>{musicImgDropItems.isDragActive ? "Drag here..." :"Music Url (Optional)"} </Typography>
                        <LandscapeRoundedIcon />
                    </Button>
                    {musicImgFileToUpdate? 
                    <Chip color="primary" label={musicImgFileToUpdate.name} sx={{ maxWidth : "250px" , border : "1px solid white"}} onDelete={() => setMusicImgFileToUpdate(null)} />
                    :<Chip color="primary" label={updateMusicDialogItems.selectedMusic.musicImgUrl ? "Original Music Image" : "No Image yet !" } icon={<LandscapeRoundedIcon sx={{ fontSize : "15px" , color : "secondary.main" }} />} sx={{ border : (updateMusicDialogItems.selectedMusic.musicImgUrl ? "1px solid #1d53a9" : "1px solid gray") , bgcolor : (updateMusicDialogItems.selectedMusic.musicImgUrl ? "primary.main" : "primary.light") }} onDelete={updateMusicDialogItems.selectedMusic.musicImgUrl ? () => setUpdateMusicDialogItems({...updateMusicDialogItems , selectedMusic : { ...updateMusicDialogItems.selectedMusic , musicImgUrl : undefined } }) : undefined }   />}
                </Box>

                <Box sx={{ display : "flex" , flexDirection :"column" , gap : "5px" , alignItems : "start" }}>
                    <Button {...musicDropItems.getRootProps()}  variant="outlined" sx={{ width : "100%" , borderRadius : "25px" , color : "white" , borderColor : "primary.main" , textTransform : "none" , py : "12px" , display : 'flex' , justifyContent : "space-between"}} >
                        <input {...musicDropItems.getInputProps()} accept="audio/*" />
                        <Typography>{musicDropItems.isDragActive ? "Drag here..." :"Music *"} </Typography>
                        <MusicNoteRoundedIcon />
                    </Button>
                    {musicFileToUpdate? 
                    <Chip color="primary" label={musicFileToUpdate.name} sx={{ maxWidth : "250px" , border : "1px solid white"}} onDelete={() => setMusicFileToUpdate(null)} />
                    :<Chip color="primary" label={"Original Music"} icon={<MusicNoteRoundedIcon sx={{ fontSize : "15px" }} />} sx={{ border : "1px solid #1d53a9"}} />}
                </Box>
                <Box sx={{ display : "flex" , justifyContent : "space-between"}} >
                    <Button variant="outlined" sx={{ color : "white" , borderColor : "lightgray"}} onClick={() => {
                        setUpdateMusicDialogItems(null);
                        setMusicFileToUpdate(null);
                    }} >Cancel</Button>
                    <Button variant="contained" disabled={!updateMusicDialogItems.selectedMusic.name} sx={{ bgcolor : "#1d53a9"}} onClick={handleUpdateMusic} >Comfirm</Button>
                </Box>
            </DialogContent>
        </Dialog>
    )
}

export default UpdateMusicDialog;