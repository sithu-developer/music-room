import { Box, Slide } from "@mui/material"
import EmojiPicker, { EmojiStyle } from "emoji-picker-react"
import { Dispatch, SetStateAction, useEffect, useRef } from "react"

interface Props {
    openEmojiBox : boolean
    cursorPosition : number
    setMessage :  Dispatch<SetStateAction<string>>
    setCursorPosition : Dispatch<SetStateAction<number>>
}

const EmojiBox = ({ openEmojiBox , cursorPosition , setCursorPosition , setMessage } : Props) => {
    const cursorRef = useRef<number>(0);

    useEffect(() => {
        cursorRef.current = cursorPosition
    } ,[ cursorPosition ])

    return (
        <Slide in={openEmojiBox} direction="up" mountOnEnter unmountOnExit>
            <Box sx={{
                position : 'absolute' , 
                bottom : { xs : "102%" , sm : "0px" }, 
                left : { xs : "0px" , sm : "350px"},
                width : { xs : "calc(100vw - 40px)" , sm : "300px" },
                height : { xs : "35vh" , sm : "53vh" },
                
                }}>
                <EmojiPicker open={openEmojiBox} skinTonesDisabled emojiStyle={EmojiStyle.FACEBOOK}
                    previewConfig={{
                        showPreview : false
                    }}
                    onEmojiClick={eO => {
                        setMessage(prev => {
                            const frontString = prev.slice(0 , cursorRef.current);
                            const restString = prev.slice(cursorRef.current)
                            return frontString + eO.emoji + restString;
                        });
                        setCursorPosition(prev => prev+2 )
                    }}  
                    style={{ backgroundColor : "#fff" , height : "100%" , width : "100%" , borderRadius : "20px" }} 
                />
            </Box>
        </Slide>
    )
}

export default EmojiBox;