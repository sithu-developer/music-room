"use client"
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import ApiRoundedIcon from '@mui/icons-material/ApiRounded';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Box, Button, Chip, Dialog, DialogContent, IconButton, Paper, Slide, TextField, Typography } from "@mui/material";
import { useState } from 'react';
import { useAppSelector } from '@/store/hooks';
import Image from 'next/image';
import { NewRoomType } from '@/type/room';

interface Props {
    openNewRoom : boolean
    setOpenNewRoom : ( value : boolean ) => void;
}

const defaultNewRoom : NewRoomType = {
    name : "" , roomPassword : "" , roommateQty : 1 , currentRoomImageId : 0 , playingMusicId : 0 , ownerUserId : 0
}

const NewRoom = ({ openNewRoom , setOpenNewRoom } : Props ) => {
    const [ isShown , setIsShown ] = useState<boolean>(true);
    const [ showPassword , setShowPassword ] = useState<boolean>(false);
    const roomImages = useAppSelector(store => store.roomImage.items)
    const musics = useAppSelector(store => store.music.items);
    const [ newRoom , setNewRoom ] = useState<NewRoomType>(defaultNewRoom);
    
    return (
        <Dialog open={openNewRoom} fullScreen sx={{}} >
            <DialogContent sx={{ bgcolor : "primary.light" }} >
                <Box sx={{ display : "flex" , justifyContent : "space-between" , alignItems : "center" }}>
                    <Typography sx={{ textAlign : "center" , fontSize : "27px" , fontWeight : "bold" , background : "linear-gradient( 45deg  , #0c0b0b , #0c0b0b, #0c0b0b , #fff , #fff , #fff)" , textShadow : "1px 1px 25px #b5b2b2" , backgroundClip : "text" , WebkitBackgroundClip : "text"  , width : "fit-content" , color : "transparent"  }} >Your Own Room</Typography>
                    <Box sx={{ display : "flex" , gap : "20px"}}>
                        <IconButton sx={{  border : "1px solid white"}} onClick={() => {
                            setIsShown(!isShown)
                        }}>
                            <ApiRoundedIcon sx={{ color : "white"}}/>
                        </IconButton>
                        <IconButton sx={{  border : "1px solid white"}} onClick={() => {
                            setOpenNewRoom(false);
                            setNewRoom(defaultNewRoom);
                            setIsShown(true);
                        }}>
                            <ClearRoundedIcon sx={{ color : "white"}} />
                        </IconButton>
                    </Box>
                </Box>

                <Slide direction="left"  in={isShown} mountOnEnter unmountOnExit >
                    <Paper sx={{ position : "fixed" , right : 20 , top : 80 , bgcolor : "transparent", borderRadius : "10px" }}>
                        <Box sx={{ display : 'flex' , flexDirection : "column" , gap : "20px" , width : "300px" , maxHeight : "70vh" , p : "20px", background : "rgba(75, 110, 113, 0.1)" , backdropFilter : "blur(10px)" , WebkitBackdropFilter : "blur(10px)" , border : "1px solid white" , borderRadius : "10px" , position : "relative" , zIndex : 10 , overflowY : "auto" }}>
                            <Typography sx={{ textAlign : "center"}} variant='h6' >Room Details</Typography>
                            <TextField value={newRoom.name}  sx={{ input : { color : "white" } }} variant="outlined" label="Room Name" onChange={(e) => setNewRoom({ ...newRoom , name : e.target.value }) } />
                            <TextField value={newRoom.roomPassword}  sx={{ input : { color : "white" } }} variant="outlined" label="Password (Optional)" onChange={(e) => setNewRoom({ ...newRoom , roomPassword : e.target.value }) } type={(showPassword ? "text" : "password")} slotProps={{ input : { endAdornment : (showPassword ? <VisibilityOff sx={{ cursor : "pointer" , color : "white"}} onClick={() => setShowPassword(false)} /> : <Visibility sx={{ cursor : "pointer" , color : "white"}} onClick={() => setShowPassword(true)} />) } }} />
                            <TextField value={newRoom.roommateQty} sx={{ input : { color : "white" } }} variant="outlined" label="Roomates Quantity" type='number' onChange={(e) => {
                                const roommateQty = Number(e.target.value);
                                if(roommateQty > 0) {
                                    setNewRoom({ ...newRoom , roommateQty  })
                                } else {
                                    setNewRoom({ ...newRoom , roommateQty : 1 })
                                }
                            } } />
                            <Box>
                                <Typography sx={{ mb : "5px", cursor : "default"}}>Room Images</Typography>
                                <Box sx={{ display : "flex" , gap : "10px" , width : "100%" , overflowX : "auto" , userSelect : "none"}} >
                                    {roomImages.map(item => (
                                        <Box key={item.id} sx={{ mb : "5px" , cursor : "pointer" }} onClick={() => setNewRoom({ ...newRoom , currentRoomImageId : item.id})} >
                                            <Typography sx={{ textAlign : "center" , bgcolor : "primary.dark" , p : "5px", borderRadius : "5px 5px 0 0" , border : (newRoom.currentRoomImageId === item.id ? "1px solid white" : "") , borderBottom : "none" }}>{item.vite}</Typography>
                                            <Image alt='Room Image' src={item.bgImageUrl} width={400} height={300} style={{ height : "80px" , width : "auto" , minWidth : "100%", borderRadius : "0 0 5px 5px" , border : (newRoom.currentRoomImageId === item.id ? "1px solid white" : "")  }} />
                                        </Box>
                                    ))}
                                </Box>
                            </Box>
                            <Box>
                                <Typography sx={{ mb : "5px" , cursor : "default"}}>First Music</Typography>
                                <Box sx={{ display : "flex" , gap : "10px" , width : "100%" , overflowX : "auto" , userSelect : "none" }} >
                                    {musics.map(item => (
                                        <Chip key={item.id} label={item.name} sx={{ bgcolor : "primary.dark" , color : "white" , border : (newRoom.playingMusicId === item.id ? "1px solid white" : "") }} onClick={() => setNewRoom({ ...newRoom , playingMusicId : item.id })} />
                                    ))}
                                </Box>
                            </Box>
                            <Box sx={{ display : "flex" , justifyContent : "space-between" , px : "10px" }}>
                                <Button variant='outlined' sx={{ color : "white" , borderColor : "white"}} onClick={() => setNewRoom(defaultNewRoom)} >Cancel</Button>
                                <Button variant='contained' sx={{ color : "white" , borderColor : "white"}} onClick={() => console.log(newRoom)} disabled={(!newRoom.name || !newRoom.roommateQty || !newRoom.currentRoomImageId || !newRoom.playingMusicId)} >Comfirm</Button>
                            </Box>
                        </Box>
                    </Paper>
                </Slide>
            </DialogContent>
        </Dialog>
    )
}

export default NewRoom;