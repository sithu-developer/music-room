"use-client"
import { Box, ButtonBase, SvgIconProps } from "@mui/material";
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import { useState } from "react";
import KeyboardArrowUpRoundedIcon from '@mui/icons-material/KeyboardArrowUpRounded';
import WallpaperIcon from '@mui/icons-material/Wallpaper';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import SettingsIcon from '@mui/icons-material/Settings';
import Image from "next/image";
import { useAppSelector } from "@/store/hooks";
import { useRouter } from "next/navigation";


const UserSideBar = () => {
    const user = useAppSelector(store => store.user.item);
    const [ isOpenSideBar , setIsOpenSideBar ] = useState<boolean>(false);
    const router = useRouter();

    if(!user) return null;

    return (
        <Box sx={{ position : "absolute" , left : "20px" , zIndex : 1 , transition : "all 0.6s ease-in-out" , height : (isOpenSideBar ? "290px" : "110px") , bgcolor : "primary.dark" , display : "flex" , flexDirection : "column" , gap : "10px" , justifyContent : "end" , alignItems : "center" , borderRadius : "0 0 30px 10px" , pb : "2px" , boxShadow : "3px 10px 25px black"}} >
            {isOpenSideBar ? 
            userSideBarItems.map(item => (
                <Box component={ButtonBase} onClick={(e) => {
                    e.stopPropagation();
                }} key={item.id} sx={{ position : "relative" , zIndex : 2 , p : "8px"}} >
                    <item.icon sx={{ color : "whitesmoke" , fontSize : "25px" }} />
                </Box>
            ))
            : undefined}
            <Box component={ButtonBase} onClick={() => router.push("/user/profile")} sx={{ position : "absolute" , top : "9px", zIndex : 2 , display : "flex" , justifyContent : "center" , alignItems : "center" , height : "52px" , width : "52px" , borderRadius : "30px" , overflow : "hidden" , border : "1px solid #13caeb" , transition : "all 0.2s ease-in-out" , boxShadow : "0 0 10px #13caeb", ":hover" : { scale : 1.1 , boxShadow : "0 0 20px #13caeb" } }}>
                <Image alt="Profile Photo" src={user.url} width={200} height={200} style={{ height : "auto" , width : "100%" }} />
            </Box>
            <Box component={ButtonBase} onClick={() => setIsOpenSideBar(!isOpenSideBar)}  sx={{ transition : "all 0.1s linear" , height : (isOpenSideBar ? "40px" : "100%") , display : "flex" , alignItems : "end" , p : "8px" , borderRadius : "0 0 30px 10px"}} >
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