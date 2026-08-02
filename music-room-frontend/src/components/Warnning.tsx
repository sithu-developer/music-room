import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { deleteCategory } from "@/store/slices/categorySlice";
import { changeIsLoading, changeSnackBarItems } from "@/store/slices/generalSlice";
import { deleteMusic } from "@/store/slices/musicSlice";
import { deleteRoomImage } from "@/store/slices/roomImageSlice";
import { Room, User } from "@/type/prisma";
import { WarnningItemType } from "@/type/warnning";
import { Box, Button, Dialog, DialogContent, Typography } from "@mui/material"
import { useEffect, useState } from "react";

interface Props {
    warnningItem : WarnningItemType;
    setWarnningItem : ( value : WarnningItemType ) => void;
}

const WarnningDialog = ({ warnningItem , setWarnningItem } : Props ) => {
    const dispatch = useAppDispatch();
    const { open , categoryToDelete , roomImageToDelete , musicToDelete } = warnningItem;
    const [ permisionString , setPermisionString ] = useState<string>("");
    const rooms = useAppSelector(store => store.room.items)
    const roomMates = useAppSelector(store => store.roomMate.items)
    const users = useAppSelector(store => store.user.allUsers);

    useEffect(() => {
        if(rooms.length) {
            if(roomImageToDelete) {
                const usedRooms = rooms.filter(room => room.currentRoomImageId === roomImageToDelete.id);
                const isRequestedInRoom = roomMates.find(roomMate => roomMate.requestRoomImageId === roomImageToDelete.id)
                if(usedRooms.length) {
                    setPermisionString(`This room image is using in Rooms [ ${usedRooms.map(item => item.name).join(" , ")} ].`);
                } else if(isRequestedInRoom) {
                    const foundRoom = rooms.find(room => room.id === isRequestedInRoom.roomId) as Room;
                    setPermisionString(`This room image was requested in Room [ ${foundRoom.name} ].`);
                }
            }

            if(musicToDelete) {
                const isUsedInRoom = rooms.find(room => room.playingMusicId === musicToDelete.id);
                const isRequestedInRoom = roomMates.find(roomMate => roomMate.requestMusicId === musicToDelete.id)
                if(isUsedInRoom) {
                    setPermisionString(`This music is playing in Room [ ${isUsedInRoom.name} ].`);
                } else if(isRequestedInRoom) {
                    const foundRoom = rooms.find(room => room.id === isRequestedInRoom.roomId) as Room;
                    setPermisionString(`This music was requested in Room [ ${foundRoom.name} ].`);
                }
            }
        }
    } , [roomImageToDelete , musicToDelete , rooms , roomMates])

    const handleDelete = () => {
        if(categoryToDelete) {
            dispatch(changeIsLoading(true));
            dispatch(deleteCategory({ id :categoryToDelete.id , onSuccess : () => {
                setWarnningItem({ open : false })
                dispatch(changeIsLoading(false));
                dispatch(changeSnackBarItems({ open : true , message : `Category \"${categoryToDelete.name}\" is deleted !` , severity : "success" }))
            }}))
        }
        if(roomImageToDelete) {
            dispatch(changeIsLoading(true));
            dispatch(deleteRoomImage({ id : roomImageToDelete.id , onSuccess : () => {
                setWarnningItem({ open : false })
                dispatch(changeIsLoading(false));
                dispatch(changeSnackBarItems({ open : true , message : `Room Image \"${roomImageToDelete.vite}\" is deleted !` , severity : "success" }))
            }}))
        }
        if(musicToDelete) {
            dispatch(changeIsLoading(true));
            dispatch(deleteMusic({ id : musicToDelete.id , onSuccess : () => {
                setWarnningItem({ open : false });
                dispatch(changeIsLoading(false));
                dispatch(changeSnackBarItems({ open : true , message : `Music \"${musicToDelete.name}\" is deleted !` , severity : "success" }))
            }}))
        }
    }

    return (
        <Dialog open={open} onClose={() => {
            setWarnningItem({ open : false });
            setPermisionString("")
        }}  >
            <DialogContent  sx={{ background : "linear-gradient(135deg, #28ced1 , #1a8181 , #1ecc78 , #208aee)" , display : "flex" , flexDirection : "column" , gap : "20px" , maxWidth : "350px"  }}>
                <Typography sx={{ fontSize : "23px" , textAlign : "center" }} >Delete {categoryToDelete && "Category"}{roomImageToDelete && "Room Image"}{musicToDelete && "Music"}</Typography>
                <Typography>Are you sure that you want to delete this {categoryToDelete && "category \" " + categoryToDelete.name + " \"."}{roomImageToDelete && "room image \" " + roomImageToDelete.vite + " \"."  }{musicToDelete && "music \" " + musicToDelete.name + " \"."  }</Typography>
                {permisionString && <Box>
                    <Typography >{permisionString}</Typography>
                    <Typography>It cannot be deletable !</Typography>
                </Box>}
                <Box sx={{ display : "flex" , justifyContent : "center" , gap : "20px" , mt : "15px"}}>
                    <Button variant="outlined" color="inherit" onClick={() => {
                        setWarnningItem({ open : false });
                        setPermisionString("");
                    }} >Cancel</Button>
                    <Button variant="contained" disabled={Boolean(permisionString)} color="error" onClick={handleDelete}>Comfirm</Button>
                </Box>
            </DialogContent>
        </Dialog>
    )
}

export default WarnningDialog;