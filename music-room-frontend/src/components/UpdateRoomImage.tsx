import { Box, Button, Chip, Dialog, DialogContent, IconButton, Slide, TextField, Typography } from "@mui/material"
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { useCallback, useEffect, useState } from "react"
import { useDropzone } from "react-dropzone";
import { ExtraImagesToUpdateType, RoomImageToUpdateType, UpdateRoomImageItemsType } from "@/type/roomImage";
import Image from "next/image";
import { Rnd } from "react-rnd";
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import ApiRoundedIcon from '@mui/icons-material/ApiRounded';
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateRoomImage } from "@/store/slices/roomImageSlice";



interface Props {
    updateRoomImageItems : UpdateRoomImageItemsType
    setUpdateRoomImageItems : ( value : UpdateRoomImageItemsType ) => void
}

const UpdateRoomImageDialog = ({ setUpdateRoomImageItems , updateRoomImageItems } : Props ) => {
    const [ roomImageToUpdate , setRoomImageToUpdate ] = useState<RoomImageToUpdateType>();
    const [ extraImagesToUpdate , setExtraImagesToUpdate ] = useState<ExtraImagesToUpdateType[]>([]);
    const [ isShown , setIsShown ] = useState<boolean>(true);
    const dispatch = useAppDispatch();
    const admin = useAppSelector(store => store.admin.item)
    const extraImages = useAppSelector(store => store.extraImage.items)

    console.log(extraImagesToUpdate)    
    useEffect(() => {
        if(updateRoomImageItems.selectedRoomImage) {
            const relatedExtraImages = extraImages.filter(item => item.roomImageId === updateRoomImageItems.selectedRoomImage?.id).map(item => ({...item , tempId : `${item.id}-${Math.floor(Math.random() * 10000)}` }))
            setRoomImageToUpdate(updateRoomImageItems.selectedRoomImage);
            setExtraImagesToUpdate(relatedExtraImages)
        }
    } , [ updateRoomImageItems.selectedRoomImage , extraImages ])

    const onDropBackgroundImage = useCallback((backgroundImages : File[]) => {
        const bgImage = backgroundImages[0];
        if(!bgImage) return;
        if (!bgImage.type.startsWith("image/")) {
            alert("Please select an image file");
            return;
        }
        if(!roomImageToUpdate) return null;
        
        setRoomImageToUpdate({ ...roomImageToUpdate , bgImage }) 
    }, [])

    const onDropExtraImages = useCallback((extraImages : File[]) => {
        if(!extraImages.length) return;
        const isNotImage = extraImages.find(item => !item.type.startsWith("image/"))
        if (isNotImage) {
            alert("Please select only an image or images!");
            return;
        }
        const preExtraImages = extraImages.map(item => ({ id : 0 , imageUrl : "" , roomImageId : (roomImageToUpdate ? roomImageToUpdate.id : 0) , tempId : `${item.name}-${item.lastModified}-${Math.floor(Math.random() * 10000)}` , extraImage : item , height : "100px" , width : "100px" , x : Math.floor(Math.random() * 300) , y : Math.floor(Math.random() * 300) }))
        setExtraImagesToUpdate(prev => ([...prev , ...preExtraImages ]))
    }, [])

    const backgroundImageDropItems = useDropzone({onDrop : onDropBackgroundImage})
    const extraImagesDropItems = useDropzone({onDrop : onDropExtraImages })

    if(!admin || !roomImageToUpdate ) return null;

    const handleUpdateRoomImage = () => {
        if(roomImageToUpdate.bgImage) {
            // upload bgImage
            // upload new extra Images
            const extraImages = extraImagesToUpdate.map(item => ({ id : item.id , imageUrl : item.imageUrl , roomImageId : item.roomImageId , height : item.height , width : item.width , x : item.x , y  : item.y }))
            dispatch(updateRoomImage({...roomImageToUpdate , bgImageUrl : roomImageToUpdate.bgImageUrl , extraImages , onSuccess : () => {
                setUpdateRoomImageItems({ open : false })
                setRoomImageToUpdate(undefined);
                setExtraImagesToUpdate([])
                setIsShown(true)
            }}))
        } else {
            // upload new extra Images
            const extraImages = extraImagesToUpdate.map(item => ({ id : item.id , imageUrl : item.imageUrl , roomImageId : item.roomImageId , height : item.height , width : item.width , x : item.x , y  : item.y }))
            dispatch(updateRoomImage({...roomImageToUpdate , extraImages , onSuccess : () => {
                setUpdateRoomImageItems({ open : false })
                setRoomImageToUpdate(undefined);
                setExtraImagesToUpdate([])
                setIsShown(true)
            }}))
        }
    }

    return (
        <Dialog fullScreen open={updateRoomImageItems.open} >
            <DialogContent sx={{ background : (roomImageToUpdate.bgImage ? `url(${URL.createObjectURL(roomImageToUpdate.bgImage)})` : `url(${roomImageToUpdate.bgImageUrl})` ) , backgroundSize : "cover" , backgroundPosition : "center" , backgroundRepeat : "no-repeat"  , overflow : "hidden"  }}>
                <Box sx={{ width : "100%" , display : "flex" , justifyContent : "space-between" , alignItems : "center" , mb : "10px" }}>
                    <IconButton onClick={() => setIsShown((prev) => (!prev))} sx={{  border : "1px solid #234448"}} >
                        <ApiRoundedIcon sx={{ color : "white"}}/>
                    </IconButton>
                    <Typography sx={{ fontSize : "27px" , fontWeight : "bold" , background : "linear-gradient(90deg, #5635fa, #fd086a, #00ffd9)" , width : "fit-content" , WebkitBackgroundClip : "text" , backgroundClip : "text" , color : "transparent" , textShadow : "2px 2px 4px rgba(0,0,0,0.6)" }} >Update Room Image</Typography>
                    <IconButton sx={{  border : "1px solid #234448"}} onClick={() => {
                        setUpdateRoomImageItems({ open : false })
                        setRoomImageToUpdate(undefined);
                        setExtraImagesToUpdate([])
                        setIsShown(true)
                    }}>
                        <ClearRoundedIcon sx={{ color : "white"}} />
                    </IconButton>
                </Box>
                
                <Slide direction="right" in={isShown} mountOnEnter unmountOnExit >
                    <Box sx={{ display : 'flex' , flexDirection : "column" , gap : "20px" , width : "300px" , p : "20px" , background : "rgba(75, 110, 113, 0.1)" , backdropFilter : "blur(10px)" , WebkitBackdropFilter : "blur(10px)" , border : "1px solid #3e648c" , borderRadius : "10px" , position : "relative" , zIndex : 10 }}>
                        <TextField value={roomImageToUpdate.vite} sx={{ input : { color : "white" }}} variant="outlined" label="Vite Name" onChange={(e) => setRoomImageToUpdate({...roomImageToUpdate , vite : e.target.value }) } />
                        <Box sx={{ display : "flex" , flexDirection :"column" , gap : "5px" , alignItems : "start"}}>
                            <Button {...backgroundImageDropItems.getRootProps()}  variant="outlined" sx={{ width : "100%" , borderRadius : "25px" , color : "white" , borderColor : "primary.main" , textTransform : "none" , py : "12px" , display : 'flex' , justifyContent : "space-between"}} >
                                <input {...backgroundImageDropItems.getInputProps()}  />
                                <Typography>{backgroundImageDropItems.isDragActive ? "Drag here..." :"Background Image"} </Typography>
                                <AddPhotoAlternateIcon />
                            </Button>
                            <Chip color="primary" label={roomImageToUpdate.bgImage ? roomImageToUpdate.bgImage.name : "Original Background"} disabled={!roomImageToUpdate.bgImage} onDelete={() => setRoomImageToUpdate(prev => ({ ...roomImageToUpdate , bgImage : undefined }))} />
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
                            <Button variant="outlined" sx={{ color : "white" , borderColor : "lightgray"}} onClick={() => setIsShown(false)} >Hide</Button>
                            <Button variant="contained" disabled={!roomImageToUpdate.vite} onClick={handleUpdateRoomImage} >Update</Button>
                        </Box>
                    </Box>
                </Slide>
                
                {extraImagesToUpdate.map(item => (
                    <Rnd
                        key={item.tempId}
                        cancel=".no-drag"
                        bounds="window"
                        style={{ padding : "5px" , border : "1px solid black" , borderRadius : "10px" }}
                        size={{ width : item.width , height : item.height }}
                        position={{ x : item.x , y : item.y }}
                        onDragStop={(e , d)=> {
                            const reExtraImages = extraImagesToUpdate.map(extImg => extImg.tempId === item.tempId ? {...item , x : d.x , y : d.y } : extImg )
                            setExtraImagesToUpdate(reExtraImages)
                        }}
                        onResizeStop={(e , direction , ref , delta , position) => {
                            const reExtraImages = extraImagesToUpdate.map(extImg => extImg.tempId === item.tempId ? { ...item , ...position , width : ref.style.width , height : ref.style.height } : extImg )
                            setExtraImagesToUpdate(reExtraImages)
                        }}
                    >
                        <Image alt="Bg image" src={item.extraImage ? URL.createObjectURL(item.extraImage) : item.imageUrl } width={200} height={200}
                            style={{ width : "100%" , height : "100%" }}
                            draggable={false}
                        />
                        <IconButton className="no-drag" onClick={() => {
                            const filteredItems = extraImagesToUpdate.filter(eI => eI.tempId !== item.tempId)
                            setExtraImagesToUpdate(filteredItems)
                        } } sx={{ border : "1px solid black" , position : "absolute" , top : "-50px" , right : "50%" , zIndex : 10 , transform : "translateX(50%)" , background : "rgba(75, 110, 113, 0.1)" , backdropFilter : "blur(10px)" , WebkitBackdropFilter : "blur(10px)" }}>
                            <ClearRoundedIcon sx={{ color : "white"}} />
                        </IconButton>
                    </Rnd>
                ))}
            </DialogContent>
        </Dialog>
    )
}

export default UpdateRoomImageDialog;