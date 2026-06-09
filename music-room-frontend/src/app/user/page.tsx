'use client';

import { Box, Button, Typography } from "@mui/material";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";

const UserSignInPage = () => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted)  return null;
    return (
        <Box sx={{ height : "100vh" ,  display : "flex" , alignItems : "center" , justifyContent : "center" , bgcolor : "primary.light" }} >
            <Box sx={{ display : "flex" , bgcolor : "primary.dark" , borderRadius : "10px" , overflow : "hidden" }} >
                <Box sx={{ width : "400px" , display : "flex" , flexDirection : "column" , alignItems : "center" , gap : "80px" }} >
                    <Typography variant="h4" sx={{ mt : "80px"}} >Sign Up</Typography>
                    <Button variant="outlined" sx={{ mt : "60px" , color : "white" , borderColor : "white" , textTransform : "none" , fontSize : "18px" }} onClick={() => signIn("google" , { callbackUrl : "/user/rooms" })} >Continue with Google</Button>
                </Box>
                <Image alt="Piano photo" src={"/piano.jpg"} width={2000} height={2000} style={{ width : "400px" , height : "auto"}} />
            </Box>
        </Box>
    )

}

export default UserSignInPage;