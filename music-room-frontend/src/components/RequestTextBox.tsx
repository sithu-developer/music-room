import { Box, IconButton, Typography } from "@mui/material";
import { useAppSelector } from "@/store/hooks";
import { Roommates } from "@/type/prisma";

interface Props {
    myRoomMateRole : Roommates
}

const RequestTextBox = ({ myRoomMateRole } : Props ) => {
    const roomImages = useAppSelector(store => store.roomImage.items);

    return (
        <Box sx={{ position : "absolute" , bottom : "20px" , right : "20px" }}>
            {myRoomMateRole.requestRoomImageId && (() => {  // think for admin side to accpet
                const textArray = ("You are requesting the owner to set background Image (" + roomImages.find(roomImg => roomImg.id === myRoomMateRole.requestRoomImageId)?.vite + ") .....").split("")
                
                const totalDuration = (textArray.length * 0.05) + 0.6 + 1;
                return (
                    <Box sx={{ display : "flex" , alignItems : "center" , gap : "10px"}}>
                        <Typography>
                            {textArray.map((eachChar , index) => (
                                <Box component="span" key={index} 
                                    sx={{ 
                                        display : "inline-block", 
                                        whiteSpace : (eachChar === " " ? "pre" : "normal") , 
                                        animation : `bounce ${totalDuration}s infinite ease-in-out`,
                                        animationDelay : `${index * 0.05}s`,
                                        '@keyframes bounce' : {
                                            "0%" : {
                                                transform : "translateY(0)"
                                            },
                                            [`${(0.3 / totalDuration) * 100}%`] : {
                                                transform : "translateY(-10px)"
                                            },
                                            [`${(0.6 / totalDuration) * 100}%`] : {
                                                transform : "translateY(0)"
                                            },
                                            "100%" : {
                                                transform : "translateY(0)"
                                            }
                                        }
                                    }} 
                                >
                                    {eachChar}
                                </Box>
                            ))}
                        </Typography>
                    </Box>
                )
            })()}
        </Box>
    )
}

export default RequestTextBox;