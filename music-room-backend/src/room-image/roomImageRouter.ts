import express, { Request, Response }  from "express"
import { prisma } from "../../util/prisma";
import { NewExtraImage } from "../../util/type";
import { ExtraImage } from "../../generated/prisma/client";

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

roomImageRouter.put("/" , (req : Request , res : Response , next) => {
    const { id , bgImageUrl , vite , adminId , userId , extraImages } = req.body;
    const isValid = id && bgImageUrl && vite && extraImages;
    if(!isValid || !(adminId || userId)) return res.status(400).send("Bad request");
    next();
} ,async( req : Request , res : Response ) => {
    const { id , bgImageUrl , vite , adminId , userId , extraImages } = req.body;
    const isExit = await prisma.roomImage.findUnique({ where : { id }});
    if(!isExit) return res.status(400).send("Bad request");
    const updatedRoomImage = await prisma.roomImage.update({ where : { id } , data : { vite , bgImageUrl , adminId , userId }});
    const extraImagesToUpdate = (extraImages as ExtraImage[]).filter(item => item.id);
    const extraImagesToCreate = (extraImages as ExtraImage[]).filter(item => !item.id);
    
    const updatedExtraImages = await prisma.$transaction(
        extraImagesToUpdate.map(item => prisma.extraImage.update({ where : { id : item.id } , data : { height : item.height , width : item.width , x : item.x , y : item.y } }))
    );

    const exitExtraImageIds = extraImagesToUpdate.map(item => item.id);
    await prisma.extraImage.deleteMany({ where : { id : { notIn : exitExtraImageIds } , roomImageId : id } })

    const createdExtraImages = await prisma.$transaction(
        extraImagesToCreate.map(item => prisma.extraImage.create({ data : { roomImageId : id , imageUrl : item.imageUrl , height : item.height , width : item.width , x : item.x , y : item.y } }))
    )
    
    return res.status(200).json({ updatedRoomImage , finalExtraImages : [...updatedExtraImages , ...createdExtraImages] });
})

roomImageRouter.delete("/" , ( req : Request , res : Response , next ) => {
    const id = Number(req.query.id);
    if(!id) return res.status(400).send("Bad request");
    next();
} , async( req : Request , res : Response ) => {
    const id = Number(req.query.id);
    const isExit = await prisma.roomImage.findUnique({ where : { id }});
    if(!isExit) return res.status(400).send("Bad request");
    await prisma.extraImage.deleteMany({ where : { roomImageId : id }});
    await prisma.roomImage.delete({ where : { id }});
    return res.status(200).json({ deletedId : id })
})

export default roomImageRouter;