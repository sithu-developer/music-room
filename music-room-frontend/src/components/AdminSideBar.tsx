"use client"
import { Box, Drawer, IconButton, ListItemButton, SvgIconProps, Typography } from "@mui/material";
import ReorderIcon from '@mui/icons-material/Reorder';
import { useState } from "react";
import CategoryIcon from '@mui/icons-material/Category';
import WallpaperIcon from '@mui/icons-material/Wallpaper';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import Link from "next/link";

const AdminSideBar = () => {
    const [ openSideBar , setOpenSideBar ] = useState(false);

    return (
        <Box>
            <IconButton sx={{ position : "absolute" , top : "10px" , left : "10px"}} onClick={() => setOpenSideBar(true)} >
                <ReorderIcon sx={{ color : "whitesmoke"}} />
            </IconButton>
            <Drawer open={openSideBar} onClose={() => setOpenSideBar(false)}>
                <Box sx={{ bgcolor : "primary.dark", width : "200px" , height : "100%" }}>
                    {adminSideBarItems.map(item => (
                        <Link href={item.url}  key={item.id} >
                            <Box sx={{ borderBottom : "1px solid white"}} >
                                <ListItemButton sx={{ display : "flex" , alignItems : "center" , gap : "10px" , p : "20px 10px"}} >
                                    <item.icon sx={{ color : "white"}} />
                                    <Typography>{item.name}</Typography>
                                </ListItemButton>
                            </Box>
                        </Link>
                    ))}
                </Box>
            </Drawer>
        </Box>
    )
}

export default AdminSideBar;

interface AdminSideBarItemType {
    id : number;
    name : string;
    url : string;
    icon : React.ComponentType<SvgIconProps>
}

const adminSideBarItems : AdminSideBarItemType[] = [
    {
        id : 1,
        name : "Room Category",
        icon : CategoryIcon,
        url : "/admin/category"
    },
    {
        id : 2,
        name : "Room Image",
        icon : WallpaperIcon,
        url : "/admin/room-image"
    },
    {
        id : 3,
        name : "Music",
        icon : MusicNoteIcon,
        url : "/admin/music"
    },
    
]