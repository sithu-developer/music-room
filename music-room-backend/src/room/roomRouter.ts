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
    const { id , userId , currentRoomImageId , playingMusicId } = req.body;
    const isValid = id && userId;
    if(!isValid) return res.status(400).send("Bad request")
    next();
} , async(req : Request , res : Response) => {
    const { id , userId , currentRoomImageId , playingMusicId } = req.body;
    const room = await prisma.room.findUnique({ where : { id }});
    const isRoomMateUser = await prisma.roommates.findUnique({ where : { userId } })
    if(!room || !isRoomMateUser) return res.status(400).send("Bad request")
    if(room.ownerUserId === userId) {
        const updatedRoom = await prisma.room.update({ where : { id } , data : { currentRoomImageId , playingMusicId } });
        res.status(200).json({ updatedRoom })
    } else {
        const updatedRoomMate = await prisma.roommates.update({ where : { userId } , data : { requestRoomImageId : currentRoomImageId , requestMusicId : playingMusicId } })
        res.status(200).json({ updatedRoomMate })
    }

})

export default roomRouter;