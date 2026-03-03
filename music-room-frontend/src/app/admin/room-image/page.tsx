"use client"
import NewRoomImage from '@/components/NewRoomImage';
import { useAppSelector } from '@/store/hooks';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { Box, ButtonGroup, Divider, IconButton, Paper, Typography } from "@mui/material";
import Image from 'next/image';
import { useState } from 'react';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import { UpdateRoomImageItemsType } from '@/type/roomImage';
import UpdateRoomImageDialog from '@/components/UpdateRoomImage';

const RoomImagePage = () => {
    const [ openNewRoomImageDialog , setOpenNewRoomImageDialog ] = useState<boolean>(false);
    const [ updateRoomImageItems , setUpdateRoomImageItems ] = useState<UpdateRoomImageItemsType>({ open : false });
    const roomImages = useAppSelector(store => store.roomImage.items);

    return (
        <Box sx={{ bgcolor : "primary.light" , width : "100vw" , height : "100vh" , p : "10px"}} >
            <Box sx={{ display : "flex" , alignItems : 'center' , justifyContent : "space-between" , px : "10px"}}>
                <span />
                <Typography sx={{ textAlign : "center" , fontSize : "30px" }} >Room Images</Typography>
                <IconButton sx={{ borderRadius : "11px" , border : "1px solid white"}} onClick={() => setOpenNewRoomImageDialog(true)} >
                    <AddRoundedIcon sx={{ color : "whitesmoke"}} />
                </IconButton>
            </Box>
            <Box sx={{ display : "flex" , gap : "10px" , p : "5px"}}>
                {roomImages.map(item => (
                    <Box key={item.id} sx={{ width : "200px" , height : "200px" , display : "flex" , flexDirection : "column" , alignItems : "center" }}>
                        <Box sx={{ bgcolor : "primary.main" , p : "2px 10px" , border : "1px solid #1b383b" , borderBottom : "none" , borderRadius : "15px 15px 0px 0px"}}>
                            <Typography>{item.vite}</Typography>
                        </Box>
                        <Box sx={{ bgcolor : "primary.main" , border : "3px solid #3e648c" , borderRadius : "8px" , display : "flex" , justifyContent : "center" , alignItems : "center" ,  overflowY : "hidden" }}>
                            <Image alt="Room Image" src={item.bgImageUrl} width={1000} height={1000} style={{ width : "100%" , height : "auto" , borderRadius : "5px"}} />
                        </Box>
                        <Box  sx={{ bgcolor : "primary.main" , border : "1px solid #1b383b" , borderRadius : "20px" , display : "flex" , marginTop : "5px" , justifySelf : "end"}} >
                            <IconButton sx={{ borderRadius : "20px 0px 0px 20px" }} onClick={() => setUpdateRoomImageItems({ open : true , selectedRoomImage : item })}>
                                <EditOutlinedIcon sx={{ color : "#dedcdc"}} />
                            </IconButton>
                            <Divider orientation='vertical' flexItem />
                            <IconButton sx={{ borderRadius : "0px 20px 20px 0px" }}>
                                <DeleteOutlineRoundedIcon sx={{ color : "#e62f2f"}} />
                            </IconButton>
                        </Box>                                              
                    </Box>
                ))}
            </Box>
            <NewRoomImage openNewRoomImageDialog={openNewRoomImageDialog} setOpenNewRoomImageDialog={setOpenNewRoomImageDialog} />
            <UpdateRoomImageDialog setUpdateRoomImageItems={setUpdateRoomImageItems} updateRoomImageItems={updateRoomImageItems}  />
        </Box>
    )
}

export default RoomImagePage;