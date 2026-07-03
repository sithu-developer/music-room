"use-client"
import { Box, ButtonBase, SvgIconProps } from "@mui/material";
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import { useState } from "react";
import KeyboardArrowUpRoundedIcon from '@mui/icons-material/KeyboardArrowUpRounded';
import WallpaperIcon from '@mui/icons-material/Wallpaper';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import SettingsIcon from '@mui/icons-material/Settings';


const UserSideBar = () => {

    const [ isOpenSideBar , setIsOpenSideBar ] = useState<boolean>(false);

    return (
        <Box sx={{ position : "absolute" , zIndex : 1 , transition : "all 0.6s ease-in-out" , height : (isOpenSideBar ? "450px" : "125px") , bgcolor : "primary.dark" , display : "flex" , flexDirection : "column" , gap : "10px" , justifyContent : "end" , borderRadius : "0 0 30px 10px" , overflow : "hidden" , pb : "2px"}} >
            {isOpenSideBar ? 
            userSideBarItems.map(item => (
                <Box component={ButtonBase} onClick={(e) => {
                    e.stopPropagation();
                }} key={item.id} sx={{ position : "relative" , zIndex : 2 , p : "8px"}} >
                    <item.icon sx={{ color : "whitesmoke" , fontSize : "25px" }} />
                </Box>
            ))
             : undefined}
            <Box component={ButtonBase} onClick={() => setIsOpenSideBar(!isOpenSideBar)}  sx={{ transition : "all 0.1s linear" , height : (isOpenSideBar ? "40px" : "100%") , display : "flex" , alignItems : "end" , p : "8px"}} >
                {isOpenSideBar ? 
                <KeyboardArrowUpRoundedIcon sx={{ color : "whitesmoke" , fontSize : "25px" }}  />
                :<KeyboardArrowDownRoundedIcon sx={{ color : "whitesmoke", fontSize : "25px" }} />}
            </Box>
        </Box>

    )
}

export default UserSideBar;


export interface UserSideBarItemType {
    id : number;
    name : string;
    url : string;
    icon : React.ComponentType<SvgIconProps>
}

const userSideBarItems : UserSideBarItemType[] = [

    {
        id : 2,
        name : "Room Image",
        icon : WallpaperIcon,
        url : "/user/room-image"
    },
    {
        id : 3,
        name : "Music",
        icon : MusicNoteIcon,
        url : "/user/music"
    },
    {
        id : 4,
        name : "Settings",
        icon : SettingsIcon,
        url : "/user/settings"
    },

]