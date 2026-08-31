import { Box, CircularProgress, Fade, IconButton, Paper, TextField, Typography } from "@mui/material";
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import EmojiEmotionsOutlinedIcon from '@mui/icons-material/EmojiEmotionsOutlined';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import { use, useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { sendMessage } from "@/store/slices/chatSlice";
import { Chats, Room } from "@/type/prisma";
import Image from "next/image";
import { formatChatTime } from "@/util/general";
import ReplyRoundedIcon from '@mui/icons-material/ReplyRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import EmojiBox from "./EmojiBox";

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
    const [ replyChat , setReplyChat ] = useState<Chats>();
    const [ currentRoomChats , setCurrentRoomChats ] = useState<Chats[]>([]);
    const [ openEmojiBox , setOpenEmojiBox ] = useState(false);
    const [ cursorPosition , setCursorPosition ] = useState<number>(0);

    useEffect(() => {
        if(chats.length && currentRoom) {
            const foundChats = chats.filter(item => item.roomId === currentRoom.id);
            setCurrentRoomChats(foundChats)
        }
    }, [chats , currentRoom])
    
    useEffect(() => {
        if(spanRef.current && messageOpen) {
            spanRef.current.scrollIntoView({ behavior : "smooth" })
        }
    } , [messageOpen])

    useEffect(() => {
        if(spanRef.current && currentRoomChats.length && user) {
            const lastChat = currentRoomChats[currentRoomChats.length - 1];
            if(lastChat.userId === user.id) {
                spanRef.current.scrollIntoView({ behavior : "smooth" })
            }
        }
    } , [ currentRoomChats.length , user ])

    if(!user) return null;

    const handleSendMessage = () => {
        if(message.trim()) {
            setIsLoading(true)
            dispatch(sendMessage({ message : message.trim() , roomId : currentRoom.id , userId : user.id , replyId : replyChat?.id , onSuccess : () => {
                setMessage("")
                setIsLoading(false);
                setReplyChat(undefined)
            }}))
        }
    }  

    return (
        <Fade in={messageOpen} mountOnEnter unmountOnExit>
            <Paper sx={{ zIndex : 3 , position : "fixed" , left : "20px" , bottom : 70 , bgcolor : "transparent", borderRadius : "10px" }}>
                <Box sx={{ position : "relative" , zIndex : 10 , display : 'flex' , flexDirection : "column" , justifyContent : "space-between" , gap : "5px" , width : { xs : "calc(100vw - 40px)" , sm : "330px" } , p : "10px" , height : { xs : (openEmojiBox ? "45vh" : "55vh") , sm : "55vh"} , background : "rgba(75, 110, 113, 0.1)" , backdropFilter : "blur(10px)" , WebkitBackdropFilter : "blur(10px)" , border : "1px solid white" , borderRadius : "10px"   }}>
                    <Box sx={{ height : "35px" , display : "flex" , justifyContent : "space-between" , alignItems : "center"}}>
                        <Typography sx={{ textShadow : "1px 1px 5px black" , fontWeight : "bold" , fontSize : "17px"}} >Messages</Typography>
                        <IconButton color="secondary" sx={{ p : "5px"}} onClick={() => setMessageOpen(false)}>
                            <ClearRoundedIcon />
                        </IconButton>
                    </Box>
                    <Box sx={{ display : "flex" , flexDirection : "column" , gap : "5px" , px : "5px" , pt : "5px" , flexGrow : 1 , overflowY : "auto" }}>
                        {currentRoomChats.map(item => {
                            const sentUser = otherUsers.find(eachUser => eachUser.id === item.userId);
                            const currentReplyChat = currentRoomChats.find(eachChat => eachChat.id === item.replyId)
                            const currentReplyUser = [...otherUsers , user].find(eachUser => (currentReplyChat ? eachUser.id === currentReplyChat.userId : false));
                            return (
                                <Box key={item.id} sx={{ position : "relative" , alignSelf : (item.userId === user.id ? "end" : "start") , bgcolor : (item.userId === user.id ? "primary.main" : "") , border : (item.userId === user.id ? "" : "1px solid #fff") , maxWidth : "75%" , width : "fit-content" , p : "5px 10px" , borderRadius : "10px"}}>
                                    {sentUser && <Box sx={{ display : "flex" , alignItems : "center" , gap : "5px"}}>
                                        <Box sx={{ width : "22px" , height : "22px" , borderRadius : "7px" , overflow : "hidden" , display : "flex" , justifyContent : 'center' , alignItems : "center" }}>
                                            <Image alt="Roommate Profile" src={sentUser.url} width={100} height={100} style={{ width : "100%" , height : "auto" }} />
                                        </Box>
                                        <Typography sx={{ fontSize : "11px" , color : "primary.light" , fontWeight : "bold" }}>{sentUser.name}</Typography>
                                    </Box>}
                                    {(currentReplyChat && currentReplyUser) && <Box sx={{ bgcolor : "primary.dark" , p : "2px 5px" , mt : "5px" }}>
                                        <Typography sx={{ fontSize : "11px" , color : "primary.light" , fontWeight : "bold" }} >Reply to {currentReplyUser.name}</Typography>
                                        <Typography sx={{ fontSize : "11px" , color : "secondary.dark" , overflow : "hidden" , textOverflow : "ellipsis" , textWrap : "nowrap"  }} >{currentReplyChat.message}</Typography>
                                    </Box> }
                                    <Typography sx={{ whiteSpace : "pre-line" , py : (item.userId === user.id ? "" : "5px" )}} >{item.message}</Typography>
                                    <Typography sx={{ lineHeight : "5px" , mt : "5px" , fontSize : "10px" , textAlign : "end" }} >{formatChatTime(item.createdAt)}</Typography>
                                    <IconButton color="secondary" sx={{ position : "absolute" , bottom : "5px" , right : (item.userId === user.id ? "" : "-30px") , left : (item.userId === user.id ? "-30px" : "") , border : "1px solid white" , borderRadius : "10px" , p : "2px"}}
                                        onClick={() => setReplyChat(item)}
                                    >
                                        <ReplyRoundedIcon sx={{ fontSize : "18px"}} />
                                    </IconButton>
                                </Box>
                            )
                        })}
                        <span ref={spanRef} />
                    </Box>
                    {replyChat && (
                        () => {
                            const replyUser = otherUsers.find(eachUser => eachUser.id === replyChat.userId);
                            return (
                                <Box sx={{ border : "1px solid white" , display : "flex" , justifyContent : "space-between" , alignItems : "center" , borderRadius : "10px" , p : "3px 5px"  }} >
                                    {replyUser && <Box sx={{ width : "35px" , height : "35px" , borderRadius : "7px" , overflow : "hidden" , display : "flex" , justifyContent : 'center' , alignItems : "center" }}>
                                        <Image alt="Roommate Profile" src={replyUser.url} width={100} height={100} style={{ width : "100%" , height : "auto" }} />
                                    </Box>}
                                    <Box sx={{ width : (replyUser ? "185px" : "230px" ) , px : "2px" }}>
                                        <Typography  sx={{ textWrap : "nowrap" , textOverflow : "ellipsis" , overflow : "hidden" , fontSize : "10px" , color : "primary.light" , fontWeight : "bold" }} >Reply to {replyUser ? replyUser.name : "Youself"}</Typography>
                                        <Typography sx={{ textWrap : "nowrap" , textOverflow : "ellipsis" , overflow : "hidden" , fontSize : "14px" }}  >{replyChat.message}</Typography>
                                    </Box>
                                    <IconButton onClick={() => setReplyChat(undefined)} color="secondary" sx={{ borderRadius : "5px"  , p : "3px" }} >
                                        <CloseRoundedIcon sx={{ fontSize : "23px"}} />
                                    </IconButton>
                                </Box>
                            )
                        }
                    )()}
                    <Box sx={{ bgcolor : "primary.dark" , display : "flex" , alignItems : "center" , justifyContent : "space-between" , borderRadius : "20px"}}>
                        <IconButton color="secondary" onClick={() => setOpenEmojiBox(prev => !prev)} >
                            <EmojiEmotionsOutlinedIcon  />
                        </IconButton>
                        <TextField multiline maxRows={3} variant="standard" color="secondary" value={message} sx={{ flexGrow : 1}} onChange={(e) => {
                            setMessage(e.target.value);
                            setCursorPosition(e.target.selectionStart ?? 0)
                        }}
                            onSelect={(e) => {
                                const input = e.target as HTMLInputElement;
                                setCursorPosition(input.selectionStart ?? 0);
                            }}
                        />
                        {isLoading ? 
                        <CircularProgress color="inherit" size={35} sx={{ color : "secondary.main" , p : "5px" , ml : "5px"}} />
                        :<IconButton color="secondary" disabled={!message} onClick={handleSendMessage} >
                            <SendRoundedIcon  />
                        </IconButton>}
                    </Box>
                    <EmojiBox openEmojiBox={openEmojiBox} cursorPosition={cursorPosition} setCursorPosition={setCursorPosition} setMessage={setMessage} />
                </Box>
            </Paper>
        </Fade>
    )
}

export default ChattingBox;