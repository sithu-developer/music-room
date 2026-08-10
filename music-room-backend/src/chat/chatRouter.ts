import express, { Request, Response } from "express";
import { prisma } from "../../util/prisma";

const chatRouter = express.Router();

chatRouter.post("/" , (req : Request , res : Response , next) => {
    const { message , roomId , userId , replyId } = req.body;
    const isValid = message && roomId && userId ;
    if(!isValid) return res.status(400).send("Bad request")
    next(); 
} , async(req : Request , res : Response) => {
    const { message , roomId , userId , replyId } = req.body;
    const isRoomMate = await prisma.roommates.findUnique({ where : { roomId , userId } })
    if(!isRoomMate) return res.status(400).send("Bad request")
    const newChat = await prisma.chats.create({ data : { message , userId , roomId , replyId }});
    req.io.emit("new_chat_created" , { newChat })
    res.status(200).json({ newChat })
})

export default chatRouter;