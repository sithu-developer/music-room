"use client"
import { Box, Button, IconButton, Typography } from "@mui/material"
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import NewCategory from "@/components/NewCategory";
import { useState } from "react";
import { useAppSelector } from "@/store/hooks";
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import WarnningDialog from "@/components/Warnning";
import { WarnningItemType } from "@/type/warnning";

const ModificationPage = () => {
    const [ openNewCategory , setOpenNewCategory ] = useState(false);
    const [ warnningItem , setWarnningItem ] = useState<WarnningItemType>({ open : false });
    const categories = useAppSelector(store => store.category.items);
    
    return (
        <Box sx={{ bgcolor : "primary.light" , width : "100vw" , height : "100vh" , p : "10px"}} >
            <Box sx={{ display : "flex" , alignItems : 'center' , justifyContent : "space-between" , px : "10px"}}>
                <span />
                <Typography sx={{ textAlign : "center" , fontSize : "30px" }} >Category</Typography>
                <IconButton sx={{ borderRadius : "11px" , border : "1px solid white"}} onClick={() => setOpenNewCategory(true)} >
                    <AddRoundedIcon sx={{ color : "whitesmoke"}} />
                </IconButton>
            </Box>
            <Box sx={{ display : "flex" , flexWrap : "wrap" , gap : "20px" , p : "20px"}} >
                {categories.map(item => (
                    <Box key={item.id} sx={{ display : "flex" , flexDirection : 'column' , alignItems : "center" , width : "150px" , gap : "10px"}} >
                        <Box sx={{ position : "relative" , bgcolor : "secondary.main" , width : "100%" , height : "80px"  , borderRadius : "5px" , display : "flex" , justifyContent : "center" , alignItems : "center" }}>
                            <Typography>{item.name}</Typography>
                            <IconButton onClick={() => setWarnningItem({ open : true , categoryToDelete : item })} sx={{ bgcolor : "primary.main" , p : "4px" , position : "absolute" , top : "-10px" , right : "-10px" , border : "3px solid", borderColor : "primary.light" , ":hover" : { bgcolor : "primary.dark" } }}>
                                <DeleteOutlineRoundedIcon sx={{ color : "whitesmoke"}} />
                            </IconButton>
                        </Box>
                        <Button variant="contained" sx={{ width : "100%"}} >Update</Button>
                    </Box>
                )) }
            </Box>
            <NewCategory openNewCategory={openNewCategory} setOpenNewCatgory={setOpenNewCategory} />
            <WarnningDialog warnningItem={warnningItem} setWarnningItem={setWarnningItem} />
        </Box>
    )
}

export default ModificationPage;