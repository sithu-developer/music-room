"use client"
import NewRoomImage from '@/components/NewRoomImage';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { Box, IconButton, Typography } from "@mui/material";

const RoomImagePage = () => {
    return (
        <Box sx={{ bgcolor : "primary.light" , width : "100vw" , height : "100vh" , p : "10px"}} >
            <Box sx={{ display : "flex" , alignItems : 'center' , justifyContent : "space-between" , px : "10px"}}>
                <span />
                <Typography sx={{ textAlign : "center" , fontSize : "30px" }} >Room Images</Typography>
                <IconButton sx={{ borderRadius : "11px" , border : "1px solid white"}} onClick={() => {}} >
                    <AddRoundedIcon sx={{ color : "whitesmoke"}} />
                </IconButton>
            </Box>
            <NewRoomImage />
        </Box>
    )
}

export default RoomImagePage;