import { useAppDispatch } from "@/store/hooks";
import { deleteCategory } from "@/store/slices/categorySlice";
import { deleteRoomImage } from "@/store/slices/roomImageSlice";
import { WarnningItemType } from "@/type/warnning";
import { Box, Button, Dialog, DialogContent, Typography } from "@mui/material"

interface Props {
    warnningItem : WarnningItemType;
    setWarnningItem : ( value : WarnningItemType ) => void;
}

const WarnningDialog = ({ warnningItem , setWarnningItem } : Props ) => {
    const dispatch = useAppDispatch();
    const { open , categoryToDelete , roomImageToDelete } = warnningItem;

    const handleDelete = () => {
        if(categoryToDelete) {
            dispatch(deleteCategory({ id :categoryToDelete.id , onSuccess : () => {
                setWarnningItem({ open : false })
            }}))
        }
        if(roomImageToDelete) {
            dispatch(deleteRoomImage({ id : roomImageToDelete.id , onSuccess : () => {
                setWarnningItem({ open : false })
            }}))
        }
    }

    return (
        <Dialog open={open} onClose={() => setWarnningItem({ open : false })}  >
            <DialogContent  sx={{ background : "linear-gradient(135deg, #28ced1 , #1a8181 , #1ecc78 , #208aee)" , display : "flex" , flexDirection : "column" , gap : "20px"  }}>
                <Typography sx={{ fontSize : "23px" , textAlign : "center" }} >Delete {categoryToDelete && "Category"}</Typography>
                <Typography>Are you sure that you want to delete this {categoryToDelete && "category \" " + categoryToDelete.name + " \"."}{roomImageToDelete && "room image \" " + roomImageToDelete.vite + " \"."  }</Typography>
                <Box sx={{ display : "flex" , justifyContent : "center" , gap : "20px" , mt : "15px"}}>
                    <Button variant="outlined" color="inherit" onClick={() => setWarnningItem({ open : false })} >Cancel</Button>
                    <Button variant="contained" color="error" onClick={handleDelete}>Comfirm</Button>
                </Box>
            </DialogContent>
        </Dialog>
    )
}

export default WarnningDialog;