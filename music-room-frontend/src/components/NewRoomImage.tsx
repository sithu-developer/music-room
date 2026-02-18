import { Box, Button, Chip, Dialog, DialogContent, IconButton, TextField, Typography } from "@mui/material"
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import GifIcon from '@mui/icons-material/Gif';
import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone";
import { DefaultNewRoomImageType } from "@/type/roomImage";

const DefaultNewRoomImage : DefaultNewRoomImageType = {
    vite : "" 
}

const NewRoomImage = () => {
    const [ newRoomImage , setNewRoomImage ] = useState<DefaultNewRoomImageType>(DefaultNewRoomImage);

    console.log(newRoomImage)  // i have to change the design of creating room image like pre seen full screen and x y axis for gif image ( no simple dialog )


    const onDropBackgroundImage = useCallback((backgroundImages : File[]) => {
        const bgImage = backgroundImages[0];
        if(!bgImage) return;
        setNewRoomImage(prev => ({...prev , bgImage}) )
    }, [])

    const onDropGifImage = useCallback((gifImages : File[]) => {
        const gifImage = gifImages[0];
        if(!gifImage) return;
        setNewRoomImage(prev => ({...prev , gifImage}))
    }, [])

    const backgroundImageDropItems = useDropzone({onDrop : onDropBackgroundImage})
    const gifImageDropItems = useDropzone({onDrop : onDropGifImage })

    return (
        <Dialog open={true} onClose={() => {}} >
            <DialogContent sx={{ background : "linear-gradient(135deg, #28d17f , #1a8162 , #1ecc78 , #20eebe)" , display : "flex" , flexDirection : "column" , gap : "20px"  }}>
                <Typography sx={{ fontSize : "20px"}} >New Category</Typography>
                <TextField color="secondary" sx={{ input : { color : "white" }}} variant="outlined" label="Name" onChange={(e) => setNewRoomImage({...newRoomImage , vite : e.target.value }) } />
                <Box sx={{ display : "flex" , flexDirection :"column" , gap : "5px" , alignItems : "start"}}>
                    <Button {...backgroundImageDropItems.getRootProps()}  variant="outlined" sx={{ width : "100%" , color : "white" , borderColor : "lightgray" , textTransform : "none" , py : "12px" , display : 'flex' , justifyContent : "space-between"}} >
                        <input {...backgroundImageDropItems.getInputProps()}  />
                        <Typography>{backgroundImageDropItems.isDragActive ? "Drag here..." :"Background Image"} </Typography>
                        <AddPhotoAlternateIcon />
                    </Button>
                    {newRoomImage.bgImage && <Chip label={newRoomImage.bgImage.name} onDelete={() => setNewRoomImage(prev => ({...prev , bgImage : undefined}))} />}
                </Box>
                <Box sx={{ display : "flex" , flexDirection : "column" , alignItems : "start" , gap : "5px"}}>
                    <Typography sx={{ fontSize : "13px" , ml : "2px"}}>Optional</Typography>
                    <Button  {...gifImageDropItems.getRootProps()} variant="outlined" sx={{ width : "100%" , color : "white" , borderColor : "lightgray" , textTransform : "none" , py : "12px" , display : 'flex' , justifyContent : "space-between"}} >
                        <input {...gifImageDropItems.getInputProps()}  />
                        <Typography>{gifImageDropItems.isDragActive ? "Drag here..." :"Gif Image"} </Typography>
                        <GifIcon />
                    </Button>
                    {newRoomImage.gifImage && <Chip label={newRoomImage.gifImage.name} onDelete={() => setNewRoomImage(prev => ({...prev , gifImage : undefined}))} />}
                </Box>
                <Box sx={{ display : "flex" , justifyContent : "space-between"}} >
                    <Button variant="outlined" sx={{ color : "white" , borderColor : "lightgray"}} onClick={() => {
                        
                    }} >Cancel</Button>
                    <Button variant="contained" disabled={!newRoomImage.vite || !newRoomImage.bgImage} sx={{ bgcolor : "#1da9a5"}} onClick={() => {}} >Comfirm</Button>
                </Box>
            </DialogContent>
        </Dialog>
    )
}

export default NewRoomImage;