"use client"
import FloatingLines from "@/components/animation/FloatingLines";
import { Box, Button, Typography } from "@mui/material";
import { signIn } from "next-auth/react";

const AdminPage = () => {
    return (
        <Box sx={{ bgcolor : "black" , height : "100vh" , display : "flex" , justifyContent : 'center' , alignItems : "center"}}>
            <Box sx={{ position : "absolute" , zIndex : 1 , background: "rgba(255,255,255,0.1)", backdropFilter: "blur(10px)" , border: "1px solid rgba(255,255,255,0.2)" , boxShadow: "0 8px 32px rgba(0,0,0,0.25)", p : "15px 20px" , display : "flex" , flexDirection : "column" , alignItems : "center" , gap : "20px" , borderRadius : "10px" }} >
                <Typography variant="h5" sx={{ color : "white"}} >Sign Up</Typography>
                <Button variant="contained" sx={{ borderRadius : "20px"}} onClick={() => signIn("google" , { callbackUrl : "/admin/category" })} >Sign Up With Google</Button>
            </Box>
            <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
                <FloatingLines
                    enabledWaves={["top","middle","bottom"]}
                    // Array - specify line count per wave; Number - same count for all waves
                    lineCount={6}
                    // Array - specify line distance per wave; Number - same distance for all waves
                    lineDistance={5}
                    bendRadius={5}
                    bendStrength={-0.5}
                    interactive={true}
                    parallax={true}
                />    
            </div>
        </Box>
    )
}

export default AdminPage;