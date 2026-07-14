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

roomRouter.get("/" , (req : Request , res : Response , next) => {
    const { roomId , userId } = req.query;
    const isValid = roomId && userId;
    if(!isValid) return res.status(400).send("Bad request");
    next();
}, async(req : Request , res : Response ) => {
    const roomId = Number(req.query.roomId);
    const userId = Number(req.query.userId);
    const foundRoom = await prisma.room.findUnique({ where : { id : roomId }});
    const foundUser = await prisma.user.findUnique({ where : { id : userId }});
    const isExit = foundRoom && foundUser;
    if(!isExit) return res.status(400).send("Bad request");
    const roomMateUserIds = (await prisma.roommates.findMany({ where : { roomId } })).filter(item => item.userId).map(item => item.userId) as number[];
    if(!roomMateUserIds.includes(userId)) return res.status(403).send("Forbidden");
    const roomMateUsers = (await prisma.user.findMany({ where : { id : { in : roomMateUserIds } }})).map(item => ({...item , email : "" }));
    res.status(200).json({ roomMateUsers })
})

export default roomRouter;