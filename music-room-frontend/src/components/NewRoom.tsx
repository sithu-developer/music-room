"use client"
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import ApiRoundedIcon from '@mui/icons-material/ApiRounded';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Box, Button, Chip, Dialog, DialogContent, Divider, FormControlLabel, IconButton, Paper, Slide, Slider, Switch, TextField, Typography } from "@mui/material";
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import Image from 'next/image';
import { NewRoomType, RoomMateLayoutType } from '@/type/room';
import PlayMusic from './PlayMusic';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import { createNewRoom } from '@/store/slices/roomSlice';
import { changeIsLoading } from '@/store/slices/generalSlice';
import NewRoomImage from './NewRoomImage';
import NewMusicDialog from './NewMusic';
import { Rnd } from 'react-rnd';
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { useRouter } from 'next/navigation';


interface Props {
    openNewRoom : boolean
    setOpenNewRoom : ( value : boolean ) => void;
}

const defaultNewRoom : NewRoomType = {
    name : "" , roomPassword : "" , roommateQty : 1 , currentRoomImage : null , playingMusic : null , roomCategoryId : 0
}

const NewRoom = ({ openNewRoom , setOpenNewRoom } : Props ) => {
    const [ isShown , setIsShown ] = useState<boolean>(true);
    const [ showPassword , setShowPassword ] = useState<boolean>(false);
    const roomImages = useAppSelector(store => store.roomImage.items)
    const musics = useAppSelector(store => store.music.items);
    const [ newRoom , setNewRoom ] = useState<NewRoomType>(defaultNewRoom);
    const extraImages = useAppSelector(store => store.extraImage.items);
    const roomCategories = useAppSelector(store => store.category.items);
    const user = useAppSelector(store => store.user.item);
    const dispatch = useAppDispatch();
    const [ openNewRoomImageDialog , setOpenNewRoomImageDialog ] = useState(false);
    const [ isMineRoomImages , setIsMineRoomImages ] = useState(false);
    const [ openNewMusicDialog , setOpenNewMusicDialog ] = useState(false);
    const [ isMineMusics , setIsMineMusics ] = useState(false);
    const [ roomMateLayouts , setRoomMateLayouts ] = useState<RoomMateLayoutType[]>([ { tempId : 0 , h : "100px" , w : "100px" , x : Math.floor(Math.random() * 300) , y : Math.floor(Math.random() * 300)} ]);
    const router = useRouter();

    if(!user) return null;

    const handleCreateNewRoom = () => {
        if(newRoom.currentRoomImage && newRoom.playingMusic ) {
            dispatch(changeIsLoading(true))
            dispatch(createNewRoom({ ...newRoom , currentRoomImageId : newRoom.currentRoomImage.id , ownerUserId : user.id , playingMusicId : newRoom.playingMusic.id , roomMateLayouts , onSuccess : ( id ) => {
                setOpenNewRoom(false);
                setNewRoom(defaultNewRoom);
                setIsShown(true);
                setShowPassword(false)
                setIsMineRoomImages(false);
                setIsMineMusics(false)
                setRoomMateLayouts([ { tempId : 0 , h : "100px" , w : "100px" , x : Math.floor(Math.random() * 300) , y : Math.floor(Math.random() * 300)} ])
                dispatch(changeIsLoading(false))
                router.push(`/user/rooms/${id}`)
            }}))
        }
    }

    
    return (
        <Dialog open={openNewRoom} fullScreen>
            <DialogContent sx={{ position : "relative" ,  bgcolor : "primary.light" , background : ( newRoom.currentRoomImage ? `url(${newRoom.currentRoomImage.bgImageUrl})` : "" ) , backgroundSize : "cover" , backgroundPosition : "center" , backgroundRepeat : "no-repeat", overflow : "hidden" }} >
                <Box sx={{ display : "flex" , justifyContent : "space-between" , alignItems : "center" }}>
                    <Typography sx={{  zIndex : 5 , position : "relative" , userSelect : "none" , textAlign : "center" , fontSize : "27px" , fontWeight : "bold" , background : "linear-gradient( 45deg  , #0c0b0b , #0c0b0b, #0c0b0b , #fff , #fff , #fff)" , textShadow : "1px 1px 25px #b5b2b2" , backgroundClip : "text" , WebkitBackgroundClip : "text"  , width : "fit-content" , color : "transparent"  }} >{newRoom.name ? newRoom.name : "Your Own Room"}</Typography>
                    <Box sx={{ zIndex : 5 , display : "flex" , gap : "20px" }}>
                        <IconButton sx={{  border : "1px solid white"}} onClick={() => {
                            setIsShown(!isShown)
                        }}>
                            <ApiRoundedIcon sx={{ color : "white"}}/>
                        </IconButton>
                        <IconButton sx={{  border : "1px solid white"}} onClick={() => {
                            setOpenNewRoom(false);
                            setNewRoom(defaultNewRoom);
                            setIsShown(true);
                            setShowPassword(false)
                            setIsMineRoomImages(false);
                            setIsMineMusics(false)
                            setRoomMateLayouts([ { tempId : 0 , h : "100px" , w : "100px" , x : Math.floor(Math.random() * 300) , y : Math.floor(Math.random() * 300)} ])
                        }}>
                            <ClearRoundedIcon sx={{ color : "white"}} />
                        </IconButton>
                    </Box>
                </Box>

                {newRoom.playingMusic && <PlayMusic playingMusic={newRoom.playingMusic} setNewRoom={setNewRoom} />}

                {(extraImages.length && newRoom.currentRoomImage) 
                ? extraImages.filter(item => item.roomImageId === newRoom.currentRoomImage?.id).map(item => (
                    <Box key={item.id} sx={{ position : "absolute" , left : item.x , top : item.y}} >
                        <Image alt="Bg image" src={item.imageUrl} width={400} height={400}
                            style={{ width : item.width , height : item.height , padding : "5.5px" }}
                        />
                    </Box>
                ))
                : undefined}

                <Box sx={{ zIndex : 2 , position : "absolute" , top : 0 , left : 0  }} >
                    {roomMateLayouts.map(item => (
                        <Rnd
                            key={item.tempId}
                            cancel=".no-drag"
                            bounds="window"
                            style={{ padding : "5px" , border : "1px solid black" , borderRadius : "10px" }}
                            size={{ width : item.w , height : item.h }}
                            position={{ x : item.x , y : item.y }}
                            onDragStop={(e , d)=> {
                                const reRoomMateLayouts = roomMateLayouts.map(eachRoomImgLayout => eachRoomImgLayout.tempId === item.tempId ? {...item , x : d.x , y : d.y } : eachRoomImgLayout )
                                setRoomMateLayouts(reRoomMateLayouts)
                            }}
                            onResizeStop={(e , direction , ref , delta , position) => {
                                const reRoomMateLayouts = roomMateLayouts.map(eachRoomImgLayout => eachRoomImgLayout.tempId === item.tempId ? { ...item , ...position , w : ref.style.width , h : ref.style.height } : eachRoomImgLayout )
                                setRoomMateLayouts(reRoomMateLayouts)
                            }}
                        >
                            <Image alt="Bg image" src={(item.tempId === 0 ? user.url : "/roomMate.jpg")} width={200} height={200}
                                style={{ width : "100%" , height : "100%" }}
                                draggable={false}
                            />
                            
                            {item.tempId === 0 ? <Typography sx={{ position : "absolute" , top : "-25px" , right : "50%" , zIndex : 10 , transform : "translateX(50%)"  }}>You</Typography>
                            :<IconButton className="no-drag" onClick={() => {
                                if(newRoom.roommateQty !== 1 ) {
                                    const filteredItems = roomMateLayouts.filter(eachRoomImgLayout => eachRoomImgLayout.tempId !== item.tempId)
                                    setRoomMateLayouts(filteredItems);
                                    setNewRoom({ ...newRoom , roommateQty : newRoom.roommateQty - 1  });
                                }
                            } } sx={{ border : "1px solid black" , position : "absolute" , top : "-50px" , right : "50%" , zIndex : 10 , transform : "translateX(50%)" , background : "rgba(75, 110, 113, 0.1)" , backdropFilter : "blur(10px)" , WebkitBackdropFilter : "blur(10px)" }}>
                                <ClearRoundedIcon sx={{ color : "white"}} />
                            </IconButton>}
                            
                        </Rnd>
                    ))}
                </Box>

                <Slide direction="left" in={isShown} mountOnEnter unmountOnExit >
                    <Paper sx={{ zIndex : 2 , position : "fixed" , right : 20 , top : 80 , bgcolor : "transparent", borderRadius : "10px" }}>
                        <Box sx={{ position : "relative" , zIndex : 10 , display : 'flex' , flexDirection : "column" , width : "300px" , maxHeight : "70vh" , background : "rgba(75, 110, 113, 0.1)" , backdropFilter : "blur(10px)" , WebkitBackdropFilter : "blur(10px)" , border : "1px solid white" , borderRadius : "10px"  }}>
                            <Typography sx={{ textAlign : "center" ,  position : "sticky" , top : 0 , p : "10px 0 25px 0"}} variant='h6' >Room Details</Typography>
                            <Box sx={{ display : 'flex' , flexDirection : "column" , gap : "20px" , p : "20px" , overflowY : "auto" }} >
                                <Box>
                                    <Typography sx={{ mb : "5px" , cursor : "default"}}>Room Categories</Typography>
                                    <Box sx={{ display : "flex" , gap : "10px" , width : "100%" , overflowX : "auto" , userSelect : "none" , pb : "5px" }} >
                                        {roomCategories.map(item => (
                                            <Chip key={item.id} label={item.name} sx={{ bgcolor : "primary.dark" , color : "white" , border : (newRoom.roomCategoryId && newRoom.roomCategoryId === item.id ? "1px solid white" : "") }} onClick={() => setNewRoom({ ...newRoom , roomCategoryId : item.id })} />
                                        ))}
                                    </Box>
                                </Box>
                                <TextField value={newRoom.name} color='secondary' sx={{ input : { color : "white" } }} variant="outlined" label="Room Name" onChange={(e) => setNewRoom({ ...newRoom , name : e.target.value }) } />
                                <TextField value={newRoom.roomPassword} color='secondary' sx={{ input : { color : "white" } }} variant="outlined" label="Password (Optional)" onChange={(e) => setNewRoom({ ...newRoom , roomPassword : e.target.value }) } type={(showPassword ? "text" : "password")} slotProps={{ input : { endAdornment : (showPassword ? <VisibilityOff sx={{ cursor : "pointer" , color : "white"}} onClick={() => setShowPassword(false)} /> : <Visibility sx={{ cursor : "pointer" , color : "white"}} onClick={() => setShowPassword(true)} />) } }} />
                                <Divider variant='middle' />
                                <Box>
                                    <Typography sx={{ cursor : "default" , mb : "10px" }}>Room Mates ( 1 to 15 )</Typography>
                                    <Box sx={{ display : "flex" , justifyContent : "center" , alignItems : "center" , gap : "20px"}}>
                                        <IconButton sx={{ bgcolor : "primary.main" , color : "secondary.main" , borderRadius : "10px" , ":hover" : { bgcolor : "primary.dark"}}} 
                                            onClick={() => {
                                                if(newRoom.roommateQty !== 1 ) {
                                                    setNewRoom({ ...newRoom , roommateQty : newRoom.roommateQty - 1  });
                                                    setRoomMateLayouts(prev => (prev.slice(0 , prev.length - 1)))
                                                }
                                            }}  
                                        >
                                            <RemoveRoundedIcon />
                                        </IconButton>
                                        <Typography >{newRoom.roommateQty}</Typography>
                                        <IconButton sx={{ bgcolor : "primary.main" , color : "secondary.main" , borderRadius : "10px" , ":hover" : { bgcolor : "primary.dark"}}}
                                            onClick={() => {
                                                if(newRoom.roommateQty !== 15 ) {
                                                    setNewRoom({ ...newRoom , roommateQty : newRoom.roommateQty + 1  });
                                                    setRoomMateLayouts(prev => ([...prev , { tempId : prev[prev.length - 1].tempId + 1 , h : "100px" , w : "100px" , x : Math.floor(Math.random() * 300) , y : Math.floor(Math.random() * 300)}]))
                                                }
                                            }}
                                        >
                                            <AddRoundedIcon />
                                        </IconButton>
                                    </Box>
                                </Box>
                                <Divider variant='middle' />
                                <Box sx={{ mt : "-10px" , display : "flex" , flexDirection : "column" , gap : "10px"}}>
                                    <Box sx={{ display : "flex"  , justifyContent : "space-between"}}>
                                        <Typography sx={{ cursor : "default"}}>Room Images</Typography>
                                        {roomImages.filter(item => item.userId ).length ? <FormControlLabel control={<Switch value={isMineRoomImages} onChange={e => setIsMineRoomImages(e.target.checked)} />} label="Mine" slotProps={{ typography : { sx : { fontSize : "13px" , ml : "-5px" }}}} />
                                        :undefined}
                                    </Box>
                                    <Box sx={{ display : "flex" , gap : "10px" , width : "100%" , overflowX : "auto" , userSelect : "none"}} >
                                        {roomImages.filter(item => (isMineRoomImages ? item.userId === user.id : !item.userId)).map(item => (
                                            <Box key={item.id} sx={{ mb : "5px" , cursor : "pointer" }} onClick={() => setNewRoom({ ...newRoom , currentRoomImage : item})} >
                                                <Typography sx={{ textAlign : "center" , bgcolor : "primary.dark" , p : "5px", borderRadius : "5px 5px 0 0" , border : (newRoom.currentRoomImage && newRoom.currentRoomImage.id === item.id ? "1px solid white" : "") , borderBottom : "none" }}>{item.vite}</Typography>
                                                <Image alt='Room Image' src={item.bgImageUrl} width={400} height={300} style={{ height : "80px" , width : "auto" , minWidth : "100%", borderRadius : "0 0 5px 5px" , border : (newRoom.currentRoomImage && newRoom.currentRoomImage.id  === item.id ? "1px solid white" : "")  }} />
                                            </Box>
                                        ))}
                                    </Box>
                                    <Button variant='contained' onClick={() => setOpenNewRoomImageDialog(true)} sx={{ width : "100%" , borderRadius : "10px" , textTransform : "none" }} >Create</Button>
                                </Box>
                                <Divider variant='middle' />
                                <Box sx={{ mt : "-10px" , display : "flex" , flexDirection : "column" , gap : "10px"}} >
                                    <Box sx={{ display : "flex"  , justifyContent : "space-between"}}>
                                        <Typography sx={{ cursor : "default"}}>First Music</Typography>
                                        {musics.filter(item => item.userId ).length ? <FormControlLabel control={<Switch value={isMineRoomImages} onChange={e => setIsMineMusics(e.target.checked)} />} label="Mine" slotProps={{ typography : { sx : { fontSize : "13px" , ml : "-5px" }}}} />
                                        :undefined}
                                    </Box>
                                    <Box sx={{ display : "flex" , gap : "10px" , width : "100%" , overflowX : "auto" , userSelect : "none" , pb : "5px" }} >
                                        {musics.filter(item => (isMineMusics ? item.userId === user.id : !item.userId)).map(item => (
                                            <Chip key={item.id} icon={<MusicNoteIcon color='inherit' fontSize='inherit' />} label={item.name} sx={{ bgcolor : "primary.dark" , color : "white" , border : (newRoom.playingMusic && newRoom.playingMusic.id === item.id ? "1px solid white" : "") }} onClick={() => setNewRoom({ ...newRoom , playingMusic : item })} />
                                        ))}
                                    </Box>
                                    <Button onClick={() => setOpenNewMusicDialog(true)} variant='contained' sx={{ width : "100%" , borderRadius : "10px" , textTransform : "none" }} >Create</Button>
                                </Box>
                                <Divider variant='middle' />
                                <Box sx={{ display : "flex" , justifyContent : "space-between"}}>
                                    <Button variant='outlined' sx={{ color : "white" , borderColor : "white"}} onClick={() => setNewRoom(defaultNewRoom)} >Cancel</Button>
                                    <Button variant='contained' sx={{ color : "white" , borderColor : "white"}} onClick={handleCreateNewRoom} disabled={(!newRoom.roomCategoryId || !newRoom.name || !newRoom.roommateQty || !newRoom.currentRoomImage || !newRoom.playingMusic)} >Comfirm</Button>
                                </Box>
                            </Box>
                        </Box>
                    </Paper>
                </Slide>
                {openNewRoomImageDialog && <NewRoomImage openNewRoomImageDialog={openNewRoomImageDialog} setOpenNewRoomImageDialog={setOpenNewRoomImageDialog} />}
                {openNewMusicDialog && <NewMusicDialog open={openNewMusicDialog} setOpen={setOpenNewMusicDialog} />}
            </DialogContent>
        </Dialog>
    )
}

export default NewRoom;