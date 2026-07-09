import { Box, Button, Chip, Dialog, DialogContent, TextField, Typography } from "@mui/material"
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import MusicNoteRoundedIcon from '@mui/icons-material/MusicNoteRounded';
import { DefaultNewMusicType } from "@/type/music";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { createMusic } from "@/store/slices/musicSlice";
import { changeIsLoading, changeSnackBarItems } from "@/store/slices/generalSlice";

interface Prop {
    open : boolean;
    setOpen : ( value : boolean) => void;
}

const NewMusicDialog = ({ open , setOpen } : Prop ) => {
    const [ newMusic , setNewMusic ] = useState<DefaultNewMusicType>({ name : "" });
    const dispatch = useAppDispatch();
    const admin = useAppSelector(store => store.admin.item)

    const onMusicDrop = useCallback((backgroundImages : File[]) => {
        const music = backgroundImages[0];
        if(!music) return;
        if (!music.type.startsWith("audio/")) {
            alert("Please select an music file");
            return;
        }
        setNewMusic(prev => ({...prev , music}) )
    }, [])

    const musicDropItems = useDropzone({onDrop : onMusicDrop })

    if(!admin) return null;

    const handleCreateNewMusic = () => {
        dispatch(changeIsLoading(true))
        dispatch(createMusic({ name : newMusic.name , musicUrl : "/" , adminId : admin.id , onSuccess : () => {
            setOpen(false);
            setNewMusic({ name : "" })
            dispatch(changeIsLoading(false));
            dispatch(changeSnackBarItems({ open : true , message : "New Music is Created !" , severity : "success" }))
        }}))
    }
    
    return (
        <Dialog open={open} onClose={() => {
            setOpen(false);
            setNewMusic({ name : "" })
        }}  >
            <DialogContent sx={{ display : "flex" , flexDirection : "column" , gap : "20px"  , bgcolor : "#5182e3" , border : "1px solid #3e648c"}}>
                <Typography  sx={{ fontSize : "20px"}} >New Music</Typography>
                <TextField label="Name" sx={{ input : { color : "white" }}} onChange={(e) => setNewMusic({...newMusic , name : e.target.value}) }  />
                
                <Box sx={{ display : "flex" , flexDirection :"column" , gap : "5px" , alignItems : "start" }}>
                    <Button {...musicDropItems.getRootProps()}  variant="outlined" sx={{ width : "100%" , borderRadius : "25px" , color : "white" , borderColor : "primary.main" , textTransform : "none" , py : "12px" , display : 'flex' , justifyContent : "space-between"}} >
                        <input {...musicDropItems.getInputProps()} accept="audio/*" />
                        <Typography>{musicDropItems.isDragActive ? "Drag here..." :"Music"} </Typography>
                        <MusicNoteRoundedIcon />
                    </Button>
                    {newMusic.music && <Chip color="primary" sx={{ maxWidth : "250px"}} label={newMusic.music.name} onDelete={() => setNewMusic(prev => ({...prev , music : undefined}))} />}
                </Box>
                <Box sx={{ display : "flex" , justifyContent : "space-between"}}>
                    <Button variant="outlined" sx={{ color : "white" , borderColor : "lightgray"}} onClick={() => {
                        setOpen(false);
                        setNewMusic({ name : "" })
                    }} >Cancel</Button>
                    <Button variant="contained" disabled={!(newMusic.name && newMusic.music)} sx={{ bgcolor : "#1d53a9"}} onClick={handleCreateNewMusic} >Comfirm</Button>
                </Box>
            </DialogContent>
        </Dialog>
    )
}

export default NewMusicDialog;


// "linear-gradient(135deg, #58b0eb 0% , #f6b8db 50% , #b2c0ef 100%)"
