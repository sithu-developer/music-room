import express, { Request, Response } from "express";
import { prisma } from "../../util/prisma";
import { RoomMateLayoutType } from "../../util/type";


const roomRouter = express.Router()

roomRouter.post("/" , (req : Request , res : Response , next) => {
    const { roomCategoryId , name , roomPassword, roommateQty, currentRoomImageId, playingMusicId, ownerUserId , roomMateLayouts } = req.body;
    const isValid = name && currentRoomImageId && ownerUserId && playingMusicId && roomCategoryId && roommateQty && roomPassword !== undefined && roomMateLayouts;
    if(!isValid) return res.status(400).send("Bad request")
    next();
} , async(req : Request , res : Response) => {
    const { roomCategoryId , name , roomPassword, roommateQty, currentRoomImageId, playingMusicId, ownerUserId , roomMateLayouts } = req.body;
    const isExitRoom = await prisma.room.findUnique({ where : { ownerUserId } });
    if(isExitRoom) return res.status(400).send("Has already a room")
    const newRoom = await prisma.room.create({ data : { name , roommateQty , currentRoomImageId , ownerUserId , playingMusicId , roomCategoryId , roomPassword }});
    const newRoomMates = await prisma.$transaction(
        (roomMateLayouts as RoomMateLayoutType[]).map(item => prisma.roommates.create({ data : { userId : (item.tempId === 0 ? ownerUserId : null)  , roomId : newRoom.id , height : item.h , width : item.w , x : item.x , y : item.y } }))
    )
    res.status(200).json( { newRoom , newRoomMates } )
})

roomRouter.put("/" , (req : Request , res : Response , next) => {
    const { id , currentRoomImageId , playingMusicId } = req.body;
    const isValid = id && currentRoomImageId && playingMusicId;
    if(!isValid) return res.status(400).send("Bad request")
    next();
} , async(req : Request , res : Response) => {
    const { id , currentRoomImageId , playingMusicId } = req.body;
    const isExit = await prisma.room.findUnique({ where : { id }});
    if(!isExit) return res.status(400).send("Bad request")
    const updatedRoom = await prisma.room.update({ where : { id } , data : { currentRoomImageId , playingMusicId } });
    res.status(200).json({ updatedRoom })
})

export default roomRouter;