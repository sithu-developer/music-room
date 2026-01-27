
import { useAppDispatch } from "@/store/hooks";
import { updateCategory } from "@/store/slices/categorySlice";
import { RoomCategory } from "@/type/prisma";
import { Box, Button, Dialog, DialogContent, TextField, Typography } from "@mui/material"

interface Props {
    openUpdateCategory : boolean;
    setOpenUpdateCategory : (value : boolean) => void
    categoryToUpdate : RoomCategory;
    setCategoryToUpdate : ( value ?: RoomCategory ) => void;
}

const UpdateCategory = ({ openUpdateCategory , setOpenUpdateCategory , categoryToUpdate , setCategoryToUpdate } : Props) => {
    const dispatch = useAppDispatch();

    const handleUpdateCategory = () => {
        dispatch(updateCategory({...categoryToUpdate , onSuccess : () => {
            setOpenUpdateCategory(false);
            setCategoryToUpdate(undefined)
        }}))
    }

    return (
        <Dialog open={openUpdateCategory} onClose={() => {
            setOpenUpdateCategory(false);
            setCategoryToUpdate(undefined)
        }} >
            <DialogContent sx={{ background : "linear-gradient(135deg, #28c3d1 , #1a5381 , #1eb2cc , #2091ee)" , display : "flex" , flexDirection : "column" , gap : "20px" }}>
                <Typography  sx={{ fontSize : "20px"}} >Update Category</Typography>
                <TextField color="info" sx={{ input : { color : "white" }}} variant="outlined" label="Name" value={categoryToUpdate.name} onChange={(e) => setCategoryToUpdate({...categoryToUpdate , name : e.target.value }) }  />
                <Box sx={{ display : "flex" , flexDirection : "column" , gap : "5px"}}>
                    <Typography sx={{ fontSize : "12px" , ml : "8px"}}>Optional</Typography>
                    <Button variant="outlined" sx={{ color : "white" , borderColor : "lightgray" , textTransform : "none" , py : "12px"}} >Drop here...</Button>
                </Box>
                <Box sx={{ display : "flex" , justifyContent : "space-between"}} >
                    <Button variant="outlined" sx={{ color : "white" , borderColor : "lightgray"}} onClick={() => {
                        setOpenUpdateCategory(false);
                        setCategoryToUpdate(undefined);
                    }} >Cancel</Button>
                    <Button variant="contained" disabled={!categoryToUpdate.name} sx={{ bgcolor : "#1d53a9"}} onClick={handleUpdateCategory} >Comfirm</Button>
                </Box>
            </DialogContent>
        </Dialog>
    )
}

export default UpdateCategory;