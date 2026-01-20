"use client"
import { Box, Chip, IconButton, Typography } from "@mui/material"
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import NewCategory from "@/components/NewCategory";
import { useState } from "react";
import { useAppSelector } from "@/store/hooks";

const ModificationPage = () => {
    const [ openNewCategory , setOpenNewCategory ] = useState(false);
    const categories = useAppSelector(store => store.category.items)


    return (
        <Box sx={{ bgcolor : "primary.light" , width : "100vw" , height : "100vh" , p : "10px"}} >
            <Box sx={{ display : "flex" , alignItems : 'center' , justifyContent : "space-between" , px : "10px"}}>
                <span />
                <Typography sx={{ textAlign : "center" , fontSize : "30px" }} >Category</Typography>
                <IconButton sx={{ borderRadius : "11px" , border : "1px solid white"}} onClick={() => setOpenNewCategory(true)} >
                    <AddRoundedIcon sx={{ color : "whitesmoke"}} />
                </IconButton>
            </Box>
            <Box sx={{ display : "flex" , flexWrap : "wrap" , gap : "10px" , p : "10px"}} >
                {categories.map(item => (
                    <Chip key={item.id} label={item.name} />
                )) }
            </Box>
            <NewCategory openNewCategory={openNewCategory} setOpenNewCatgory={setOpenNewCategory} />
        </Box>
    )
}

export default ModificationPage;