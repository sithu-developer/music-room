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
        const musics = await prisma.music.findMany({ where : { adminId : isExit.id } , orderBy : { id : "asc" }});
        const users = await prisma.user.findMany({ where : { adminId : isExit.id }})
        const categoryIds = categories.map(item => item.id);
        const rooms = await prisma.room.findMany({ where : { roomCategoryId : { in : categoryIds } }});
        const roomIds = rooms.map(item => item.id)
        const roommates = await prisma.roommates.findMany({ where : { roomId : { in : roomIds } }});
        res.status(200).json({ createdAdmin : isExit , categories , roomImages , extraImages , musics , users , rooms , roommates });
    } else {
        const createdAdmin = await prisma.admin.create({ data : { email , companyName : "Default Name" }});
        res.status(200).json({ createdAdmin });
    }
})

adminRouter.put("/" , (req , res , next) => {
    const { id , companyName } = req.body;
    const isValid = id && companyName;
    if(!isValid) return res.status(400).send("Bad request")
    next();
} , async(req , res) => {
    const { id , companyName } = req.body;
    const isExit = await prisma.admin.findUnique({ where : { id } });
    if(!isExit) return res.status(400).send("Bad request");
    const updatedAdmin = await prisma.admin.update({ where : { id } , data : { companyName }});
    res.status(200).json({ updatedAdmin })
} )


export default adminRouter;