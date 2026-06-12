"use client"
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import ApiRoundedIcon from '@mui/icons-material/ApiRounded';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Box, Dialog, DialogContent, IconButton, Paper, Slide, TextField, Typography } from "@mui/material";
import { useState } from 'react';

interface Props {
    openNewRoom : boolean
    setOpenNewRoom : ( value : boolean ) => void;
}

const NewRoom = ({ openNewRoom , setOpenNewRoom } : Props ) => {
    const [ isShown , setIsShown ] = useState<boolean>(true);
    const [ showPassword , setShowPassword ] = useState<boolean>(false);
    
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
                            setOpenNewRoom(false)
                        }}>
                            <ClearRoundedIcon sx={{ color : "white"}} />
                        </IconButton>
                    </Box>
                </Box>
                <Slide direction="left"  in={isShown} mountOnEnter unmountOnExit >
                    <Paper sx={{ position : "fixed" , right : 20 , top : 80 , bgcolor : "transparent" }}>
                        <Box sx={{   display : 'flex' , flexDirection : "column" , gap : "20px" , width : "300px" , p : "20px" , background : "rgba(75, 110, 113, 0.1)" , backdropFilter : "blur(10px)" , WebkitBackdropFilter : "blur(10px)" , border : "1px solid white" , borderRadius : "10px" , position : "relative" , zIndex : 10 }}>
                            <TextField sx={{ input : { color : "white" } }} variant="outlined" label="Room Name" onChange={(e) => {} } />
                            <TextField sx={{ input : { color : "white" } }} variant="outlined" label="Password" onChange={(e) => {} } type={(showPassword ? "text" : "password")} slotProps={{ input : { endAdornment : (showPassword ? <VisibilityOff sx={{ cursor : "pointer" , color : "white"}} onClick={() => setShowPassword(false)} /> : <Visibility sx={{ cursor : "pointer" , color : "white"}} onClick={() => setShowPassword(true)} />) } }} />
                            
                        </Box>
                    </Paper>
                </Slide>
            </DialogContent>
        </Dialog>
    )
}

export default NewRoom;