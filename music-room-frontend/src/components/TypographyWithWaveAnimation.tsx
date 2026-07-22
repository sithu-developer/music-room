import { Box, Typography } from "@mui/material";

interface Props {
    text : string
}

const TypographyWithWaveAnimation = ( { text } : Props ) => {
    const textArray = text.split("")
                
    const totalDuration = (textArray.length * 0.05) + 0.6 + 1;
    return (
        <Typography sx={{ px : "10px"}}>
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
    )
}


export default TypographyWithWaveAnimation;