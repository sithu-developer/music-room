import { Box, Typography } from "@mui/material";

const UserProfilePage = () => {
    return (
        <Box>
            <Box sx={{ display : "flex" , justifyContent : "space-between" , alignItems : "center" , width : "100%" , px : "20px" , py : "10px" , bgcolor : "primary.main", borderBottom : "1px solid white" , boxShadow : "0 5px 10px #374a5f" }} >
                <Typography variant="h4" sx={{ ml : "80px" ,textShadow : "5px 3px 10px black" }} >Rooms</Typography>
            </Box>

        </Box>
    )
}

export default UserProfilePage;