import express, { Request, Response } from "express";
import { prisma } from "../../util/prisma";
import { Admin } from "../../generated/prisma/client";


const userRouter = express.Router();

userRouter.post("/" , ( req : Request , res : Response , next) => {
    const { email , name , url } = req.body;
    const isValid = email && name && url !== undefined;
    if(!isValid) return res.status(400).send("Bad request");
    next();
} , async(req : Request , res : Response) => {
    const { email , name , url } = req.body;
    const isExit = await prisma.user.findUnique({ where : { email } });
    const admin = await prisma.admin.findFirst() as Admin; // here think about how to do
    const roomCategories = await prisma.roomCategory.findMany({ where : { adminId : admin?.id } , orderBy : { id : "asc" } })
    const roomCategoryIds = roomCategories.map(item => item.id);
    const roomsWithoutShowingPasswords = (await prisma.room.findMany({ where : { roomCategoryId : { in : roomCategoryIds } } , orderBy : { id : "asc" }})).map(item => (item.roomPassword ? {...item , roomPassword : "need password"}  : item ));
    const roomIds = roomsWithoutShowingPasswords.map(item => item.id);
    const roomMates = await prisma.roommates.findMany({ where : { roomId : { in : roomIds } } })
    const otherUsers = (await prisma.user.findMany({ where : { AND : [ {adminId : admin.id} , {id : {not : isExit?.id}}] } , orderBy : { id : "asc"} })).map(item => ({...item , email : ""}))
    const allUsersIds = isExit ? [...otherUsers.map(item => item.id) , isExit.id] : otherUsers.map(item => item.id);
    const roomImages = await prisma.roomImage.findMany({ where : { OR : [ {adminId : admin?.id} , {userId : { in : allUsersIds}} ] } , orderBy : { id : "asc" }});
    const roomImageIds = roomImages.map(item => item.id)
    const extraImages = await prisma.extraImage.findMany({ where : { roomImageId : { in : roomImageIds } } , orderBy : { id : "asc" }})
    const musics = await prisma.music.findMany({ where : { OR : [ {adminId : admin?.id} , { userId : { in : allUsersIds}}] } , orderBy : { id : "asc" }})
    if(isExit) {
        return res.status(200).json({ user : isExit , admin : {...admin , email : "" , id : 0} , roomCategories , roomImages , extraImages , musics , rooms : roomsWithoutShowingPasswords , roomMates , otherUsers })
    } else {
        const newUser = await prisma.user.create({ data : { email , name , url , adminId : admin.id } })
        res.status(200).json({ user : newUser , admin : {...admin , email : "" , id : 0} , roomCategories , roomImages , extraImages , musics , rooms : roomsWithoutShowingPasswords , roomMates , otherUsers})
    }
})

export default userRouter;