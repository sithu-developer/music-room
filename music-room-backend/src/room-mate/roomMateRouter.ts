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
        // send to all other users that is connected to the socket server
        req.io.emit("a_user_joined_a_room" , { updatedRoomMate })
        res.status(200).json({ updatedRoomMate })
    } else {
        const updatedRoomMate = await prisma.roommates.update({ where : { id : foundRoomMatePlace.id } , data : { userId } });
        // send to all other users that is connected to the socket server
        req.io.emit("a_user_joined_a_room" , { updatedRoomMate })
        res.status(200).json({ updatedRoomMate })
    }
})

roomMateRouter.put("/acceptOrReject" , (req : Request , res : Response , next) => {
    const { isAccept , isRoomImage , roomMateId } = req.body;
    const isValid = isAccept !== undefined && isRoomImage !== undefined && roomMateId;
    if(!isValid) return res.status(400).send("Bad request");
    next()
} , async( req : Request , res : Response ) => {
    const { isAccept , isRoomImage , roomMateId } = req.body;
    const isExit = await prisma.roommates.findUnique({ where : { id : roomMateId }});
    if(!isExit) return res.status(400).send("Bad request");
    if(isAccept) {
        if(isRoomImage) {
            const updatedRoom = await prisma.room.update({ where : { id : isExit.roomId } , data : { currentRoomImageId : (isExit.requestRoomImageId as number) } });
            const updatedRoomMate = await prisma.roommates.update({ where : { id : roomMateId } , data : { requestRoomImageId : null } })
            // sent to the user that request using socket
            req.io.to(String(updatedRoom.id)).emit("accept_or_reject_from_owner" , { updatedRoom , updatedRoomMate , isAccept , isRoomImage })
            req.io.emit("accept_or_reject_by_owner_check_from_outside_and_other_rooms" , { updatedRoom })
            req.io.emit("accpet_or_reject_by_owner_check_by_admin" , {updatedRoom , updatedRoomMate})
            res.status(200).json({ updatedRoom , updatedRoomMate })
        } else {
            const updatedRoom = await prisma.room.update({ where : { id : isExit.roomId } , data : { playingMusicId : (isExit.requestMusicId as number) } });
            const updatedRoomMate = await prisma.roommates.update({ where : { id : roomMateId } , data : { requestMusicId : null } })
            // sent to the user that request using socket
            req.io.to(String(updatedRoom.id)).emit("accept_or_reject_from_owner" , { updatedRoom , updatedRoomMate , isAccept , isRoomImage })
            req.io.emit("accept_or_reject_by_owner_check_from_outside_and_other_rooms" , { updatedRoom })
            req.io.emit("accpet_or_reject_by_owner_check_by_admin" , {updatedRoom , updatedRoomMate})
            res.status(200).json({ updatedRoom , updatedRoomMate })
        }
    } else {
        if(isRoomImage) {
            const updatedRoomMate = await prisma.roommates.update({ where : { id : roomMateId } , data : { requestRoomImageId : null } })
            // sent to the user that request using socket
            req.io.to(String(updatedRoomMate.roomId)).emit("accept_or_reject_from_owner" , { updatedRoomMate , isAccept , isRoomImage })
            req.io.emit("accpet_or_reject_by_owner_check_by_admin" , { updatedRoomMate})
            res.status(200).json({ updatedRoomMate })
        } else {
            const updatedRoomMate = await prisma.roommates.update({ where : { id : roomMateId } , data : { requestMusicId : null } })
            // sent to the user that request using socket
            req.io.to(String(updatedRoomMate.roomId)).emit("accept_or_reject_from_owner" , { updatedRoomMate , isAccept , isRoomImage })
            req.io.emit("accpet_or_reject_by_owner_check_by_admin" , { updatedRoomMate})
            res.status(200).json({ updatedRoomMate })
        }
    }
})

roomMateRouter.delete("/quit-room" , (req : Request , res : Response , next) => {
    const { userId } = req.query;
    if(!Number(userId)) return res.status(400).send("Bad request");
    next();

} , async(req : Request , res : Response ) => {
    const userId = Number(req.query.userId);
    const isExit = await prisma.roommates.findUnique({ where : { userId }});
    if(!isExit) return res.status(400).send("Bad request");
    const room = await prisma.room.findUnique({ where : { id : isExit.roomId }});
    if(!room) return res.status(400).send("Bad request");
    if(room.ownerUserId === userId) {
        await prisma.roommates.deleteMany({ where : { roomId : room.id }});
        await prisma.room.delete({ where : { id : room.id }});
        req.io.emit("quit_room" , { deletedRoomId : room.id , userId });
        res.status(200).json({ deletedRoomId : room.id })
    } else {
        const updatedRoomMate = await prisma.roommates.update({ where : { userId } , data : { userId : null , requestMusicId : null , requestRoomImageId : null }})
        req.io.emit("quit_room" , { updatedRoomMate , userId });
        res.status(200).json({ updatedRoomMate })
    }
})

export default roomMateRouter;