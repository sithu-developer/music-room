import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { createNewCatgory } from "@/store/slices/categorySlice";
import { Box, Button, Dialog, DialogContent, TextField, Typography } from "@mui/material"
import { useState } from "react";

interface Props {
    openNewCategory : boolean;
    setOpenNewCatgory : (value : boolean) => void;
}

const defaultNewCategory = {
    name : "" , iconImageFile : null
}

const NewCategory = ( { openNewCategory , setOpenNewCatgory } : Props ) => {
    const [ newCategory , setNewCategory ] = useState(defaultNewCategory);
    const admin = useAppSelector(store => store.admin.item);
    const dispatch = useAppDispatch();

    if(!admin) return null;

    const handleCreateNewCategory = () => {
        dispatch(createNewCatgory({ name : newCategory.name , adminId : admin.id , iconUrl : "testUrl" , onSuccess : () => {
            setNewCategory(defaultNewCategory);
            setOpenNewCatgory(false)
        } }))
    }

    return (
        <Dialog open={openNewCategory} onClose={() =>{ 
            setNewCategory(defaultNewCategory)
            setOpenNewCatgory(false);
        }} >
            <DialogContent sx={{ background : "linear-gradient(135deg, #28d17f , #1a8162 , #1ecc78 , #20eebe)" , display : "flex" , flexDirection : "column" , gap : "20px"  }}>
                <Typography sx={{ fontSize : "20px"}} >New Category</Typography>
                <TextField color="secondary" sx={{ input : { color : "white" }}} variant="outlined" label="Name" onChange={(e) => setNewCategory({...newCategory , name : e.target.value }) } />
                <Button variant="outlined" sx={{ color : "white" , borderColor : "lightgray" , textTransform : "none" , py : "12px"}} >Drop here...</Button>
                <Box sx={{ display : "flex" , justifyContent : "space-between"}} >
                    <Button variant="outlined" sx={{ color : "white" , borderColor : "lightgray"}} onClick={() => {
                        setOpenNewCatgory(false);
                        setNewCategory(defaultNewCategory)
                    }} >Cancel</Button>
                    <Button variant="contained" disabled={!newCategory.name} sx={{ bgcolor : "#1da9a5"}} onClick={handleCreateNewCategory} >Comfirm</Button>
                </Box>
            </DialogContent>
        </Dialog>
    )
}

export default NewCategory;