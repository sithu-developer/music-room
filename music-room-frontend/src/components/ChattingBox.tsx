import { Box, CircularProgress, Fade, IconButton, Paper, TextField, Typography } from "@mui/material";
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import EmojiEmotionsOutlinedIcon from '@mui/icons-material/EmojiEmotionsOutlined';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import { use, useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { sendMessage } from "@/store/slices/chatSlice";
import { Room } from "@/type/prisma";
import { changeIsLoading } from "@/store/slices/generalSlice";
import Image from "next/image";

interface Props {
    messageOpen : boolean;
    setMessageOpen : ( value : boolean ) => void;
    currentRoom : Room
}

const ChattingBox = ({ messageOpen , setMessageOpen , currentRoom } : Props) => {
    const [ message , setMessage ] = useState<string>("");
    const user = useAppSelector(store => store.user.item);
    const otherUsers = useAppSelector(store => store.user.otherUsers);
    const dispatch = useAppDispatch();
    const [ isLoading , setIsLoading ] = useState(false);
    const chats = useAppSelector(store => store.chat.items);
    const spanRef = useRef< HTMLSpanElement | null >(null);
    
    useEffect(() => {
        if(spanRef.current && messageOpen) {
            spanRef.current.scrollIntoView({ behavior : "smooth" })
        }
    } , [messageOpen])

    if(!user) return null;

    const handleSendMessage = () => {
        if(message.trim()) {
            setIsLoading(true)
            dispatch(sendMessage({ message : message.trim() , roomId : currentRoom.id , userId : user.id , onSuccess : () => {
                setMessage("")
                setIsLoading(false);
            }}))
        }
    }  

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
                    <Box sx={{ display : "flex" , flexDirection : "column" , gap : "5px" , px : "5px" , flexGrow : 1 , overflowY : "auto" }}>
                        {chats.map(item => {
                            const sentUser = otherUsers.find(eachUser => eachUser.id === item.userId);
                            return (
                                <Box key={item.id} sx={{ alignSelf : (item.userId === user.id ? "end" : "start") , bgcolor : (item.userId === user.id ? "primary.main" : "") , border : (item.userId === user.id ? "" : "1px solid #fff") , maxWidth : "75%" , width : "fit-content" , p : "5px 10px" , borderRadius : "10px"}}>
                                    {sentUser && <Box sx={{ display : "flex" , alignItems : "center" , gap : "5px"}}>
                                        <Box sx={{ width : "25px" , height : "25px" , borderRadius : "7px" , overflow : "hidden" , display : "flex" , justifyContent : 'center' , alignItems : "center" }}>
                                            <Image alt="Roommate Profile" src={sentUser.url} width={100} height={100} style={{ width : "100%" , height : "auto" }} />
                                        </Box>
                                        <Typography sx={{ fontSize : "11px"}}>{sentUser.name}</Typography>
                                    </Box>}
                                    <Typography sx={{ whiteSpace : "pre-line" , py : (item.userId === user.id ? "" : "5px" )}} >{item.message}</Typography>
                                </Box>
                            )
                        })}
                        <span ref={spanRef} />
                    </Box>
                    <Box sx={{ bgcolor : "primary.dark" , display : "flex" , alignItems : "center" , justifyContent : "space-between" , borderRadius : "20px"}}>
                        <IconButton color="secondary" >
                            <EmojiEmotionsOutlinedIcon  />
                        </IconButton>
                        <TextField multiline maxRows={3} variant="standard" color="secondary" value={message} onChange={(e) => setMessage(e.target.value)} />
                        {isLoading ? 
                        <CircularProgress color="inherit" size={35} sx={{ color : "secondary.main" , p : "5px" , ml : "5px"}} />
                        :<IconButton color="secondary" onClick={handleSendMessage} >
                            <SendRoundedIcon  />
                        </IconButton>}
                    </Box>
                </Box>
            </Paper>
        </Fade>
    )
}

export default ChattingBox;