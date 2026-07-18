import express, { Request, Response } from "express"
import { prisma } from "../../util/prisma";

const roomMateRouter = express.Router();


roomMateRouter.put("/" , (req : Request , res : Response , next) => {
    const { roomId , roomPassword , userId } = req.body;
    const isValid = roomId && userId;
    if(!isValid) return res.status(400).send("Bad request");
    next();
} , async(req : Request , res : Response ) => {
    const { roomId , roomPassword , userId } = req.body;
    const room = await prisma.room.findUnique({ where : { id : roomId }})
    const user = await prisma.user.findUnique({ where : { id : userId }})
    const inAlreadyRoomMate = await prisma.roommates.findUnique({ where : { userId }})
    const foundRoomMatePlace = await prisma.roommates.findFirst({ where : { AND : [{roomId} , {userId : null}] } })
    if(!room || !user || inAlreadyRoomMate || !foundRoomMatePlace ) return res.status(400).send("Bad request");
    if(roomPassword) {
        if(roomPassword !== room.roomPassword) return res.status(403).send("Wrong Password")
        const updatedRoomMate = await prisma.roommates.update({ where : { id : foundRoomMatePlace.id } , data : { userId } });
        res.status(200).json({ updatedRoomMate })
    } else {
        const updatedRoomMate = await prisma.roommates.update({ where : { id : foundRoomMatePlace.id } , data : { userId } });
        res.status(200).json({ updatedRoomMate })
    }
})


export default roomMateRouter;