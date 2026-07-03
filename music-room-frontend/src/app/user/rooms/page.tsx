"use client"
import NewRoom from "@/components/NewRoom";
import { useAppSelector } from "@/store/hooks";
import { RoomCategory } from "@/type/prisma";
import { Box, ButtonBase, Chip, IconButton, Typography } from "@mui/material";
import Image from "next/image";
import { useEffect, useState } from "react";
import ChairRoundedIcon from '@mui/icons-material/ChairRounded';
import UserSideBar from "@/components/UserSideBar";

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
        <Box sx={{ height : "100vh" ,  display : "flex" , flexDirection : "column" , alignItems : "center" , bgcolor : "primary.light" }} >
            <Box sx={{ display : "flex" , justifyContent : "space-between" , alignItems : "center" , width : "100%" , px : "20px" , py : "8px" , bgcolor : "primary.main", borderBottom : "1px solid white" }} >
                <UserSideBar />
                <Typography variant="h4" sx={{ ml : "70px"}} >Rooms</Typography>
                <IconButton onClick={() => setOpenNewRoom(true)} >
                    <ChairRoundedIcon sx={{ color : "whitesmoke" , fontSize : "30px"}} />
                </IconButton>
            </Box>
            <Box sx={{ display : "flex" , gap : "20px" , width : "100vw" , p : "0 30px 10px 90px" , overflowX : "auto"  , mt : "-0.5px"  }} >
                {categories.map(item => (
                    <Chip key={item.id} onClick={() => setSelectedCategory(item)} label={item.name} clickable sx={{ color : "white" , borderTopRightRadius : "0" , borderTopLeftRadius : "0" , border : (selectedCategory && item.id === selectedCategory.id ? "1px solid white": "") , borderTop : "none" , bgcolor : (selectedCategory && item.id === selectedCategory.id ? "primary.main": "")  , ":hover" : { bgcolor : (selectedCategory && item.id === selectedCategory.id ? "primary.main": "") } }} />
                )) }
            </Box>
            <Box sx={{ width : "100%" , p : "10px 20px" , display : "flex" , gap : "20px" , flexWrap : "wrap"}}>
                {selectedCategory && rooms.filter(item => item.roomCategoryId === selectedCategory.id).map(item => {
                    const roomImage = roomImages.find(roomImg => roomImg.id === item.currentRoomImageId )
                    if(roomImage)
                    return (
                        <Box key={item.id} sx={{ position : "relative" ,  display : "flex" , flexDirection : "column" , alignItems : "center" , height : "250px" , borderRadius : "10px" , overflow : "hidden" }} >
                            <Box sx={{ position : "absolute" , p : "5px 8px" }}>
                                <Typography sx={{ background : "linear-gradient( 45deg  , #0c0b0b , #0c0b0b, #0c0b0b , #fff , #fff , #fff)", textShadow : "0px 0px 10px #ffffff" , fontWeight : "bold" , backgroundClip : "text" , color : "transparent" }} >{item.name}</Typography>
                            </Box>
                            <Image alt="room image" src={roomImage.bgImageUrl} width={500} height={500} style={{ height : "100%" , width : "auto"}} />
                            <Box component={ButtonBase} onClick={() => {}} sx={{ position : "absolute" , bottom : 0 , background : "rgba(255, 255, 255, 0.1)" , backdropFilter : "blur(10px)" , border : "1px solid gray" , borderRadius : "30px 30px 10px 10px" , p : "8px 30px" }}>
                                <Typography sx={{ textAlign : "center"}}>Join</Typography>
                            </Box>
                        </Box>
                    )
                })}
            </Box>
            <NewRoom openNewRoom={openNewRoom} setOpenNewRoom={setOpenNewRoom} />
        </Box>
    )

}

export default RoomsPage;