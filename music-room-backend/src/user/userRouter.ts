import express, { Request, Response } from "express";
import { prisma } from "../../util/prisma";


const userRouter = express.Router();

userRouter.post("/" , ( req : Request , res : Response , next) => {
    const { email , name , url } = req.body;
    const isValid = email && name && url !== undefined;
    if(!isValid) return res.status(400).send("Bad request");
    next();
} , async(req : Request , res : Response) => {
    const { email , name , url } = req.body;
    const isExit = await prisma.user.findUnique({ where : { email } });
    const admin = await prisma.admin.findFirst(); // here think about how to do
    const roomCategories = await prisma.roomCategory.findMany({ where : { adminId : admin?.id } , orderBy : { id : "asc" } })
    const roomCategoryIds = roomCategories.map(item => item.id);
    const rooms = await prisma.room.findMany({ where : { roomCategoryId : { in : roomCategoryIds } } , orderBy : { id : "asc" }})
    const roomImages = await prisma.roomImage.findMany({ where : { adminId : admin?.id } , orderBy : { id : "asc" }});
    const roomImageIds = roomImages.map(item => item.id)
    const extraImages = await prisma.extraImage.findMany({ where : { roomImageId : { in : roomImageIds } } , orderBy : { id : "asc" }})
    const musics = await prisma.music.findMany({ where : { adminId : admin?.id } , orderBy : { id : "asc" }})
    if(isExit) {
        return res.status(200).json({ user : isExit , admin , roomCategories , roomImages , extraImages , musics , rooms })
    } else {
        const newUser = await prisma.user.create({ data : { email , name , url } })
        res.status(200).json({ user : newUser , admin , roomCategories , roomImages , extraImages , musics , rooms})
    }
})

export default userRouter;