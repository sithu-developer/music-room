"use client"
import NewRoom from "@/components/NewRoom";
import { Box, Button, Typography } from "@mui/material";
import { useState } from "react";

const RoomsPage = () => {
    const [ openNewRoom , setOpenNewRoom ] = useState<boolean>(false);


    return (
        <Box sx={{ height : "100vh" ,  display : "flex" , flexDirection : "column" , alignItems : "center" , gap : "10px" , bgcolor : "primary.light" , p : "10px" }} >
            <Box sx={{ display : "flex" , justifyContent : "space-between" , alignItems : "center" , width : "100%" , px : "30px" , py : "8px"}} >
                <Typography variant="h4" >Rooms</Typography>
                <Button variant="outlined" sx={{ borderColor : "white" , textTransform : "none"}} onClick={() => setOpenNewRoom(true)} ><Typography>Create Your Own</Typography></Button>
            </Box>
            <Box sx={{ bgcolor : "gray" , width : "100%" , p : "10px"}}>
                q
            </Box>
            <NewRoom openNewRoom={openNewRoom} setOpenNewRoom={setOpenNewRoom} />
        </Box>
    )

}

export default RoomsPage;