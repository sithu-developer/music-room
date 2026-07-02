"use client"
import NewRoom from "@/components/NewRoom";
import { useAppSelector } from "@/store/hooks";
import { RoomCategory } from "@/type/prisma";
import { Box, Button, Chip, Typography } from "@mui/material";
import Image from "next/image";
import { useEffect, useState } from "react";

const RoomsPage = () => {
    const [ openNewRoom , setOpenNewRoom ] = useState<boolean>(false);
    const rooms = useAppSelector(store => store.room.items );
    const roomImages = useAppSelector(store => store.roomImage.items)
    const categories = useAppSelector(store => store.category.items)
    const [ selectedCategory , setSelectedCategory ] = useState<RoomCategory>();

    useEffect(() => {
        if(categories.length) {
            setSelectedCategory(categories[0]);
        }
    } , [ categories ])

    return (
        <Box sx={{ height : "100vh" ,  display : "flex" , flexDirection : "column" , alignItems : "center" , gap : "10px" , bgcolor : "primary.light" , p : "10px" }} >
            <Box sx={{ display : "flex" , justifyContent : "space-between" , alignItems : "center" , width : "100%" , px : "30px" , py : "8px"}} >
                <Typography variant="h4" >Rooms</Typography>
                <Button variant="outlined" sx={{ borderColor : "white" , textTransform : "none"}} onClick={() => setOpenNewRoom(true)} ><Typography>Create Your Own</Typography></Button>
            </Box>
            <Box sx={{ display : "flex" , gap : "20px" , maxWidth : "100vw" , p : "10px 20px" , overflowX : "auto"}} >
                {categories.map(item => (
                    <Chip key={item.id} onClick={() => setSelectedCategory(item)} label={item.name} clickable sx={{ color : "white" , border : (selectedCategory && item.id === selectedCategory.id ? "1px solid white": "") }} />
                )) }
            </Box>
            <Box sx={{ width : "100%" , p : "10px" , display : "flex" , gap : "20px" , flexWrap : "wrap"}}>
                {selectedCategory && rooms.filter(item => item.roomCategoryId === selectedCategory.id).map(item => {
                    const roomImage = roomImages.find(roomImg => roomImg.id === item.currentRoomImageId )
                    if(roomImage)
                    return (
                        <Box key={item.id} sx={{ position : "relative" ,  display : "flex" , flexDirection : "column" , alignItems : "center" , height : "250px" , borderRadius : "10px" , overflow : "hidden" }} >
                            <Box sx={{ position : "absolute" , p : "5px 8px" }}>
                                <Typography sx={{ background : "linear-gradient( 45deg  , #0c0b0b , #0c0b0b, #0c0b0b , #fff , #fff , #fff)", textShadow : "1px 1px 5px #ffffff" , fontWeight : "bold" , backgroundClip : "text" , color : "transparent" }} >{item.name}</Typography>
                            </Box>
                            <Image alt="room image" src={roomImage.bgImageUrl} width={500} height={500} style={{ height : "100%" , width : "auto"}} />
                        </Box>
                    )
                })}
            </Box>
            <NewRoom openNewRoom={openNewRoom} setOpenNewRoom={setOpenNewRoom} />
        </Box>
    )

}

export default RoomsPage;