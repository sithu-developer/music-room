import { Box, ListItemButton, Typography } from "@mui/material";
import Link from "next/link";
import { AdminSideBarItemType } from "./AdminSideBar";
import { usePathname } from "next/navigation";

interface Prop {
    adminSideBarItems : AdminSideBarItemType[]
}

const SideBarItems = ({ adminSideBarItems } : Prop) => {

    const path = usePathname();

    return (
        <Box>
            {adminSideBarItems.map(item => (
                <Link href={item.url}  key={item.id} style={{ textDecoration : "none"}} >
                    <Box sx={{ bgcolor : (item.url === path ? "primary.light" : "") , mx : "7px" , borderRadius : "5px"  }} >
                        <ListItemButton sx={{ display : "flex" , alignItems : "center" , gap : "10px" , p : "20px 10px"  }} >
                            <item.icon sx={{ color : ( item.url === path ? "black" : "white" )}} />
                            <Typography sx={{  color : ( item.url === path ? "black" : "white" ) }}>{item.name}</Typography>
                        </ListItemButton>
                    </Box>
                </Link>
            ))}
        </Box>
    )
}

export default SideBarItems;