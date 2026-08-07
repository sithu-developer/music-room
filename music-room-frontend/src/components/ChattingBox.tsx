import { Box, Fade, IconButton, Paper, TextField, Typography } from "@mui/material";
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import EmojiEmotionsOutlinedIcon from '@mui/icons-material/EmojiEmotionsOutlined';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';

interface Props {
    messageOpen : boolean;
    setMessageOpen : ( value : boolean ) => void;
}

const ChattingBox = ({ messageOpen , setMessageOpen } : Props) => {
    return (
        <Fade in={messageOpen} mountOnEnter unmountOnExit>
            <Paper sx={{ zIndex : 3 , position : "fixed" , left : 20 , bottom : 70 , bgcolor : "transparent", borderRadius : "10px" }}>
                <Box sx={{ position : "relative" , zIndex : 10 , display : 'flex' , flexDirection : "column" , justifyContent : "space-between" , gap : "5px" , width : "300px" , p : "10px" , height : "55vh" , background : "rgba(75, 110, 113, 0.1)" , backdropFilter : "blur(10px)" , WebkitBackdropFilter : "blur(10px)" , border : "1px solid white" , borderRadius : "10px"   }}>
                    <Box sx={{ height : "35px" , display : "flex" , justifyContent : "space-between" , alignItems : "center"}}>
                        <Typography sx={{ textShadow : "1px 1px 5px black" , fontWeight : "bold" , fontSize : "17px"}} >Messages</Typography>
                        <IconButton color="secondary" sx={{ p : "5px"}} onClick={() => setMessageOpen(false)}>
                            <ClearRoundedIcon />
                        </IconButton>
                    </Box>
                    <Box sx={{ display : "flex" , flexDirection : "column" , justifyContent : "end"  , flexGrow : 1 , overflowY : "auto" }}>
                        <Typography >a</Typography>
                        <Typography>a</Typography>
                        <Typography>a</Typography>
                        <Typography>a</Typography>
                        <Typography>a</Typography>
                    </Box>
                    <Box sx={{ bgcolor : "primary.dark" , display : "flex" , alignItems : "center" , justifyContent : "space-between" , borderRadius : "20px"}}>
                        <IconButton color="secondary" >
                            <EmojiEmotionsOutlinedIcon  />
                        </IconButton>
                        <TextField multiline maxRows={3} variant="standard" color="secondary" />
                        <IconButton color="secondary" >
                            <SendRoundedIcon  />
                        </IconButton>
                    </Box>
                </Box>
            </Paper>
        </Fade>
    )
}

export default ChattingBox;