"use client"
import { Box, Divider, ListItemButton, SvgIconProps, Typography } from "@mui/material";
import CategoryIcon from '@mui/icons-material/Category';
import WallpaperIcon from '@mui/icons-material/Wallpaper';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import DashboardIcon from '@mui/icons-material/Dashboard';
import SettingsIcon from '@mui/icons-material/Settings';
import SideBarItems from "./SideBarItem";

const AdminSideBar = () => {
    const path = usePathname();

    return (
        <Box sx={{ width : "250px" , height : "100vh" , p : "5px" }}>
            <Box sx={{ bgcolor : "primary.main", width : "100%" , height : "100%" , borderRadius : "7px"  }}>
                <Box sx={{ display : "flex" , alignItems : "center" , gap : "20px" , p : "30px 15px"}}>
                    <Image alt="music logo" src={"/music-logo.jpg"} width={300} height={300} style={{ width : "35px" , height : "auto" , borderRadius : "4px" }} />
                    <Typography sx={{ fontSize : "22px" , fontWeight : "600" }}>Music Room</Typography>
                </Box>

                <SideBarItems adminSideBarItems={adminSideBarItems.slice(0 , 1)} />

                <Divider variant="middle" sx={{ borderColor : "lightgray" , my : "10px" }} />

                <SideBarItems adminSideBarItems={adminSideBarItems.slice(1 , 4)} />
                
                <Divider variant="middle" sx={{ borderColor : "lightgray" , my : "10px" }} />

                <SideBarItems adminSideBarItems={adminSideBarItems.slice(4 , 5)} />

            </Box>
        </Box>
    )

    // return (
    //     <Box>
    //         <IconButton sx={{ position : "absolute" , top : "10px" , left : "10px"}} onClick={() => setOpenSideBar(true)} >
    //             <ReorderIcon sx={{ color : "whitesmoke"}} />
    //         </IconButton>
    //         <Drawer open={openSideBar} onClose={() => setOpenSideBar(false)}>
    //             <Box sx={{ bgcolor : "primary.dark", width : "200px" , height : "100%" }}>
    //                 {adminSideBarItems.map(item => (
    //                     <Link href={item.url}  key={item.id} >
    //                         <Box sx={{ borderBottom : "1px solid white"}} >
    //                             <ListItemButton sx={{ display : "flex" , alignItems : "center" , gap : "10px" , p : "20px 10px"}} >
    //                                 <item.icon sx={{ color : "white"}} />
    //                                 <Typography>{item.name}</Typography>
    //                             </ListItemButton>
    //                         </Box>
    //                     </Link>
    //                 ))}
    //             </Box>
    //         </Drawer>
    //     </Box>
    // )
}

export default AdminSideBar;

export interface AdminSideBarItemType {
    id : number;
    name : string;
    url : string;
    icon : React.ComponentType<SvgIconProps>
}

const adminSideBarItems : AdminSideBarItemType[] = [

    {
        id : 0,
        name : "Dashboard",
        icon : DashboardIcon,
        url : "/admin/dashboard"
    },
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
    {
        id : 4,
        name : "Settings",
        icon : SettingsIcon,
        url : "/admin/settings"
    },

]