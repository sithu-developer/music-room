"use client"
import { Box, Button, Typography } from "@mui/material";
import { signIn } from "next-auth/react";

const AdminPage = () => {
    return (
        <Box sx={{ bgcolor : "primary.light" , height : "100vh" , display : "flex" , justifyContent : 'center' , alignItems : "center"}}>
            <Box sx={{ background : "linear-gradient(135deg, #d128af , #158b68 , #48dbfb)" , p : "15px 20px" , display : "flex" , flexDirection : "column" , alignItems : "center" , gap : "20px" , borderRadius : "10px" }} >
                <Typography variant="h5" >Sign Up</Typography>
                <Button variant="contained" onClick={() => signIn("google" , { callbackUrl : "/admin/modification" })} >Sign Up With Google</Button>
            </Box>
        </Box>
    )
}

export default AdminPage;