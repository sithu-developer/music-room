import express from "express"
import { prisma } from "../../util/prisma";

const adminRouter = express.Router();

adminRouter.post("/" , (req , res , next) => {
    const { email } = req.body;
    if(!email) return res.status(400).send("Bad request");
    next();
} , async(req , res) => {
    const { email } = req.body;
    const isExit = await prisma.admin.findUnique({ where : { email }});
    if(isExit) {
        const categories = await prisma.roomCategory.findMany({ where : { adminId : isExit.id } , orderBy : { id : "asc" }});
        const roomImages = await prisma.roomImage.findMany({ where : { adminId : isExit.id }});
        const roomImageIds = roomImages.map(item => item.id);
        const extraImages = await prisma.extraImage.findMany({ where : { roomImageId : { in : roomImageIds } } })
        res.status(200).json({ createdAdmin : isExit , categories , roomImages , extraImages });
    } else {
        const createdAdmin = await prisma.admin.create({ data : { email , name : "Default Name" }});
        res.status(200).json({ createdAdmin });
    }
})


export default adminRouter;