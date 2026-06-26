import express, { Request, Response } from "express";
import { prisma } from "../../util/prisma";


const roomRouter = express.Router()

roomRouter.post("/" , (req : Request , res : Response , next) => {
    const { name , currentRoomImageId , ownerUserId , playingMusicId , roomCategoryId , roommateQty , roomPassword } = req.body;
    const isValid = name && currentRoomImageId && ownerUserId && playingMusicId && roomCategoryId && roommateQty && roomPassword !== undefined;
    if(!isValid) return res.status(400).send("Bad request")
    next();
} , async(req : Request , res : Response) => {
    const { name , currentRoomImageId , ownerUserId , playingMusicId , roomCategoryId , roommateQty , roomPassword } = req.body;
    const newRoom = await prisma.room.create({ data : { name , roommateQty , currentRoomImageId , ownerUserId , playingMusicId , roomCategoryId , roomPassword }});
    res.status(200).json( { newRoom } )
})

export default roomRouter;