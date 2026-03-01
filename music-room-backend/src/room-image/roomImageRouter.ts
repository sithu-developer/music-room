import express, { Request, Response }  from "express"
import { prisma } from "../../util/prisma";
import { NewExtraImage } from "../../util/type";

const roomImageRouter = express.Router();

roomImageRouter.post("/" , ( req : Request , res : Response , next ) => {
    const { vite , bgImageUrl , adminId , userId , extraImages } = req.body;
    const isValid = vite && bgImageUrl && extraImages;
    if(!isValid || !(adminId || userId)) return res.status(400).send("Bad request");
    next();
} , async( req : Request , res : Response ) => {
    const { vite , bgImageUrl , adminId , userId , extraImages } = req.body;
    const newRoomImage = await prisma.roomImage.create({ data : { vite , bgImageUrl , adminId , userId } });
    const extraImagesWithType = extraImages as NewExtraImage[]
    const newExtraImages = await prisma.$transaction(
        extraImagesWithType.map(item => prisma.extraImage.create({ data : { roomImageId : newRoomImage.id , imageUrl : item.imageUrl , height : item.height , width : item.width , x : item.x , y : item.y }}))
    )
    return res.status(200).json({ newRoomImage , newExtraImages })
})

export default roomImageRouter;