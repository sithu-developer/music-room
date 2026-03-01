import { Box, Button, Chip, Dialog, DialogContent, IconButton, Slide, TextField, Typography } from "@mui/material"
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone";
import { DefaultNewExtraImageType, DefaultNewRoomImageType } from "@/type/roomImage";
import Image from "next/image";
import { Rnd } from "react-rnd";
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import ApiRoundedIcon from '@mui/icons-material/ApiRounded';
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { createNewRoomImage } from "@/store/slices/roomImageSlice";


interface Props {
    openNewRoomImageDialog : boolean
    setOpenNewRoomImageDialog : ( value : boolean ) => void
}

const NewRoomImage = ({ openNewRoomImageDialog , setOpenNewRoomImageDialog } : Props ) => {
    const [ newRoomImage , setNewRoomImage ] = useState<DefaultNewRoomImageType>({vite : ""});
    const [ newExtraImages , setNewExtraImages ] = useState<DefaultNewExtraImageType[]>([]);
    const [ isShown , setIsShown ] = useState<boolean>(true);
    const dispatch = useAppDispatch();
    const admin = useAppSelector(store => store.admin.item)

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
        setNewExtraImages(prev => ([...prev , ...preExtraImages ]))
    }, [])

    const backgroundImageDropItems = useDropzone({onDrop : onDropBackgroundImage})
    const extraImagesDropItems = useDropzone({onDrop : onDropExtraImages })

    if(!admin) return null;

    const handleCreateNewRoomImage = () => {
        if(newRoomImage.bgImage) {
            const extraImages = newExtraImages.map(item => ({ imageUrl : item.extraImage.name , height : item.h , width : item.w , x : item.x , y : item.y }))
            dispatch(createNewRoomImage({ vite : newRoomImage.vite , bgImageUrl : newRoomImage.bgImage.name , adminId : admin.id , extraImages , onSuccess : () => {
                setOpenNewRoomImageDialog(false)
                setNewRoomImage({vite : ""});
                setNewExtraImages([])
                setIsShown(true)
            }}))
        }
    }

    return (
        <Dialog fullScreen open={openNewRoomImageDialog} >
            <DialogContent sx={{ background : (newRoomImage.bgImage ? `url(${URL.createObjectURL(newRoomImage.bgImage)})` : "linear-gradient(135deg, #18aed3 , #062c1c92 , #611eccaa , #07f1bb)") , backgroundSize : "cover" , backgroundPosition : "center" , backgroundRepeat : "no-repeat"  , overflow : "hidden"  }}>
                <Box sx={{ width : "100%" , display : "flex" , justifyContent : "space-between" , alignItems : "center" , mb : "10px" }}>
                    <IconButton onClick={() => setIsShown((prev) => (!prev))} sx={{  border : "1px solid #234448"}} >
                        <ApiRoundedIcon sx={{ color : "white"}}/>
                    </IconButton>
                    <Typography sx={{ fontSize : "27px" , fontWeight : "bold" , background : "linear-gradient(90deg, #5635fa, #fd086a, #00ffd9)" , width : "fit-content" , WebkitBackgroundClip : "text" , backgroundClip : "text" , color : "transparent" , textShadow : "2px 2px 4px rgba(0,0,0,0.6)" }} >New Room Image</Typography>
                    <IconButton sx={{  border : "1px solid #234448"}} onClick={() => {
                        setOpenNewRoomImageDialog(false)
                        setNewRoomImage({vite : ""});
                        setNewExtraImages([])
                        setIsShown(true)
                    }}>
                        <ClearRoundedIcon sx={{ color : "white"}} />
                    </IconButton>
                </Box>
                
                <Slide direction="right" in={isShown} mountOnEnter unmountOnExit >
                    <Box sx={{ display : 'flex' , flexDirection : "column" , gap : "20px" , width : "300px" , p : "20px" , background : "rgba(75, 110, 113, 0.1)" , backdropFilter : "blur(10px)" , WebkitBackdropFilter : "blur(10px)" , border : "1px solid #3e648c" , borderRadius : "10px" , position : "relative" , zIndex : 10 }}>
                        <TextField value={newRoomImage.vite} sx={{ input : { color : "white" }}} variant="outlined" label="Vite Name" onChange={(e) => setNewRoomImage({...newRoomImage , vite : e.target.value }) } />
                        <Box sx={{ display : "flex" , flexDirection :"column" , gap : "5px" , alignItems : "start"}}>
                            <Button {...backgroundImageDropItems.getRootProps()}  variant="outlined" sx={{ width : "100%" , borderRadius : "25px" , color : "white" , borderColor : "primary.main" , textTransform : "none" , py : "12px" , display : 'flex' , justifyContent : "space-between"}} >
                                <input {...backgroundImageDropItems.getInputProps()}  />
                                <Typography>{backgroundImageDropItems.isDragActive ? "Drag here..." :"Background Image"} </Typography>
                                <AddPhotoAlternateIcon />
                            </Button>
                            {newRoomImage.bgImage && <Chip color="primary" label={newRoomImage.bgImage.name} onDelete={() => setNewRoomImage(prev => ({...prev , bgImage : undefined}))} />}
                        </Box>
                        <Box sx={{ display : "flex" , flexDirection : "column" , alignItems : "start" , gap : "5px"}}>
                            <Typography sx={{ fontSize : "12px" }}>Optional</Typography>
                            <Button  {...extraImagesDropItems.getRootProps()} variant="outlined" sx={{ width : "100%" , borderRadius : "25px" , color : "white" , borderColor : "primary.main" , textTransform : "none" , py : "12px" , display : 'flex' , justifyContent : "space-between"}} >
                                <input {...extraImagesDropItems.getInputProps()}  />
                                <Typography>{extraImagesDropItems.isDragActive ? "Drag here..." :"Add Extra Images"} </Typography>
                                <AddPhotoAlternateIcon />
                            </Button>
                        </Box>
                        <Box sx={{ display : "flex" , justifyContent : "space-between" , gap : "10px"}} >
                            <Button variant="outlined" sx={{ color : "white" , borderColor : "lightgray"}} onClick={() => setIsShown(false)} >Close</Button>
                            <Button variant="contained" disabled={!newRoomImage.vite || !newRoomImage.bgImage} onClick={handleCreateNewRoomImage} >Comfirm</Button>
                        </Box>
                    </Box>
                </Slide>
                
                {newExtraImages.map(item => (
                    <Rnd
                        key={item.tempId}
                        cancel=".no-drag"
                        bounds="window"
                        style={{ padding : "5px" , border : "1px solid black" , borderRadius : "10px" }}
                        size={{ width : item.w , height : item.h }}
                        position={{ x : item.x , y : item.y }}
                        onDragStop={(e , d)=> {
                            const reExtraImages = newExtraImages.map(extImg => extImg.tempId === item.tempId ? {...item , x : d.x , y : d.y } : extImg )
                            setNewExtraImages(reExtraImages)
                        }}
                        onResizeStop={(e , direction , ref , delta , position) => {
                            const reExtraImages = newExtraImages.map(extImg => extImg.tempId === item.tempId ? { ...item , ...position , w : ref.style.width , h : ref.style.height } : extImg )
                            setNewExtraImages(reExtraImages)
                        }}
                    >
                        <Image alt="Bg image" src={URL.createObjectURL(item.extraImage)} width={200} height={200}
                            style={{ width : "100%" , height : "100%" }}
                            draggable={false}
                        />
                        <IconButton className="no-drag" onClick={() => {
                            const filteredItems = newExtraImages.filter(eI => eI.tempId !== item.tempId)
                            setNewExtraImages(filteredItems)
                        } } sx={{ border : "1px solid black" , position : "absolute" , top : "-50px" , right : "50%" , zIndex : 10 , transform : "translateX(50%)" , background : "rgba(75, 110, 113, 0.1)" , backdropFilter : "blur(10px)" , WebkitBackdropFilter : "blur(10px)" }}>
                            <ClearRoundedIcon sx={{ color : "white"}} />
                        </IconButton>
                    </Rnd>
                ))}
            </DialogContent>
        </Dialog>
    )
}

export default NewRoomImage;