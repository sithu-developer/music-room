import { Box, Button, Chip, Dialog, DialogContent, IconButton, TextField, Typography } from "@mui/material"
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone";
import { DefaultNewExtraImageType, DefaultNewRoomImageType } from "@/type/roomImage";
import Image from "next/image";
import { Rnd } from "react-rnd";


interface Props {
    openNewRoomImageDialog : boolean
    setOpenNewRoomImageDialog : ( value : boolean ) => void
}

const NewRoomImage = ({ openNewRoomImageDialog , setOpenNewRoomImageDialog } : Props ) => {
    const [ newRoomImage , setNewRoomImage ] = useState<DefaultNewRoomImageType>({vite : ""});
    const [ extraImages , setExtraImages ] = useState<DefaultNewExtraImageType[]>([]);

    console.log(extraImages) 


    const onDropBackgroundImage = useCallback((backgroundImages : File[]) => {
        const bgImage = backgroundImages[0];
        if(!bgImage) return;
        if (!bgImage.type.startsWith("image/")) {
            alert("Please select an image file");
            return;
        }
        setNewRoomImage(prev => ({...prev , bgImage}) )
    }, [])

    const onDropExtraImages = useCallback((extraImages : File[]) => {
        
        if(!extraImages.length) return;
        const isNotImage = extraImages.find(item => !item.type.startsWith("image/"))
        if (isNotImage) {
            alert("Please select only an image or images!");
            return;
        }
        const preExtraImages = extraImages.map(item => ({ tempId : `${item.name}-${item.lastModified}-${Math.floor(Math.random() * 10000)}` , extraImage : item , h : "100px" , w : "100px" , x : Math.floor(Math.random() * 300) , y : Math.floor(Math.random() * 300) }))
        setExtraImages(prev => ([...prev , ...preExtraImages ]))
    }, [])

    const backgroundImageDropItems = useDropzone({onDrop : onDropBackgroundImage})
    const extraImagesDropItems = useDropzone({onDrop : onDropExtraImages })


    return (
        <Dialog fullScreen open={openNewRoomImageDialog} onClose={() => setOpenNewRoomImageDialog(false)} >
            <DialogContent sx={{ background : (newRoomImage.bgImage ? `url(${URL.createObjectURL(newRoomImage.bgImage)})` : "linear-gradient(135deg, #28d17f , #1a8162 , #1ecc78 , #20eebe)") , backgroundSize : "cover" , backgroundPosition : "center" , backgroundRepeat : "no-repeat" , display : "flex" , flexDirection : "column" , gap : "20px"  }}>
                <Typography sx={{ fontSize : "20px" , textAlign : "center"}} >New Room Image</Typography>
                <Box sx={{ display : 'flex' , flexDirection : "column" , alignItems : "center" , gap : "5px"}}>
                    <TextField color="secondary" sx={{ input : { color : "white" }}} variant="outlined" label="Vite" onChange={(e) => setNewRoomImage({...newRoomImage , vite : e.target.value }) } />
                    <Box sx={{ display : "flex" , flexDirection :"column" , gap : "5px" , alignItems : "start"}}>
                        <Button {...backgroundImageDropItems.getRootProps()}  variant="outlined" sx={{ width : "100%" , color : "white" , borderColor : "lightgray" , textTransform : "none" , py : "12px" , display : 'flex' , justifyContent : "space-between"}} >
                            <input {...backgroundImageDropItems.getInputProps()}  />
                            <Typography>{backgroundImageDropItems.isDragActive ? "Drag here..." :"Background Image"} </Typography>
                            <AddPhotoAlternateIcon />
                        </Button>
                        {newRoomImage.bgImage && <Chip label={newRoomImage.bgImage.name} onDelete={() => setNewRoomImage(prev => ({...prev , bgImage : undefined}))} />}
                    </Box>
                    <Box sx={{ display : "flex" , flexDirection : "column" , alignItems : "start" , gap : "5px"}}>
                        {/* <Typography sx={{ fontSize : "13px" , ml : "2px"}}>Optional</Typography> */}
                        <Button  {...extraImagesDropItems.getRootProps()} variant="outlined" sx={{ width : "100%" , color : "white" , borderColor : "lightgray" , textTransform : "none" , py : "12px" , display : 'flex' , justifyContent : "space-between"}} >
                            <input {...extraImagesDropItems.getInputProps()}  />
                            <Typography>{extraImagesDropItems.isDragActive ? "Drag here..." :"Extra Images"} </Typography>
                            <AddPhotoAlternateIcon />
                        </Button>
                    </Box>
                </Box>
                <Box sx={{ display : "flex" , gap : "10px"}} >
                    <Button variant="outlined" sx={{ color : "white" , borderColor : "lightgray"}} onClick={() => {
                        setOpenNewRoomImageDialog(false)
                    }} >Cancel</Button>
                    <Button variant="contained" disabled={!newRoomImage.vite || !newRoomImage.bgImage} sx={{ bgcolor : "#1da9a5"}} onClick={() => {}} >Comfirm</Button>
                </Box>
                {extraImages.map(item => (
                    <Rnd
                        key={item.tempId}
                        bounds="window"
                        style={{ padding : "10px" , border : "1px solid black" , borderRadius : "10px" }}
                        size={{ width : item.w , height : item.h }}
                        position={{ x : item.x , y : item.y }}
                        onDragStop={(e , d)=> {
                            const reExtraImages = extraImages.map(extImg => extImg.tempId === item.tempId ? {...item , x : d.x , y : d.y } : extImg )
                            setExtraImages(reExtraImages)
                        }}
                        onResizeStop={(e , direction , ref , delta , position) => {
                            const reExtraImages = extraImages.map(extImg => extImg.tempId === item.tempId ? { ...item , ...position , w : ref.style.width , h : ref.style.height } : extImg )
                            setExtraImages(reExtraImages)
                        }}
                    >
                        <Image alt="Bg image" src={URL.createObjectURL(item.extraImage)} width={200} height={200}
                            style={{ width : "100%" , height : "100%" }}
                            draggable={false}
                        />
                    </Rnd>
                ))}
            </DialogContent>
        </Dialog>
    )
}

export default NewRoomImage;