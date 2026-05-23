"use client"
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateCompanyName } from "@/store/slices/adminSlice";
import { changeIsLoading, changeSnackBarItems } from "@/store/slices/generalSlice";
import { Box, Button, TextField, Typography } from "@mui/material"
import { signOut } from "next-auth/react";
import { useEffect, useState } from "react";

const SettingPage = () => {
    const admin = useAppSelector(store => store.admin.item);
    const [ newCompanyName , setNewCompanyName ] = useState<string>("");
    const dispatch = useAppDispatch();

    useEffect(() => {
        if(admin) {
            setNewCompanyName(admin.companyName)
        }
    } , [admin])


    if(!admin) return null;

    const handleUpdateCompanyName = () => {
        dispatch(changeIsLoading(true));
        dispatch(updateCompanyName({ id : admin.id , companyName : newCompanyName , onSuccess : () => {
            dispatch(changeIsLoading(false));
            dispatch(changeSnackBarItems({ open : true , message : "Company Name updated !" , severity : "success" }))
        } }) )
    }

    return (
        <Box  sx={{ bgcolor : "primary.light" , width : "calc(100vw - 250px)" , height : "100%" , p : "10px", borderRadius : "7px"}} >
            <Typography sx={{ textAlign : "center" , fontSize : "30px" }} >Settings</Typography>
            <Box sx={{ display : "flex" , gap : "10px" , flexWrap : "wrap" , p : "20px"}}>
                <Box sx={{ bgcolor : "primary.dark" , width : "300px" , height : "200px" , borderRadius : "10px" , display : "flex" , flexDirection : "column" , justifyContent : "space-between" , p : "20px"}}>
                    <Typography variant="h6" sx={{ color : "white" , textAlign :"center"}}>Company Name</Typography>
                    <TextField variant="standard" defaultValue={admin.companyName} slotProps={{ input : { sx : { color : "white"}} }} onChange={(e) => setNewCompanyName((e.target.value).trim())} />
                    <Button variant="contained" disabled={admin.companyName === newCompanyName || !newCompanyName} onClick={handleUpdateCompanyName} >Change Company Name</Button>
                </Box>
                <Box sx={{ bgcolor : "primary.dark" , width : "300px" , height : "200px" , borderRadius : "10px" , display : "flex" , flexDirection : "column" , justifyContent : "space-between" , p : "20px"}}>
                    <Typography variant="h6" sx={{ color : "white" , textAlign :"center"}}>Gamil Account</Typography>
                    <Typography >{admin.email}</Typography>
                    <Button variant="contained" onClick={() => signOut({ callbackUrl : "/admin" })} >Sign Out</Button>
                </Box>
            </Box>
        </Box>
    )
}

export default SettingPage;