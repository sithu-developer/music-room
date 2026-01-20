import express from "express"
import { prisma } from "../../util/prisma";

const categoryRouter = express.Router();


categoryRouter.post("/" , (req , res , next) => {
    const { name , iconUrl , adminId } = req.body;
    const isValid = name && iconUrl && adminId;
    if(!isValid) return res.status(400).send("Bad request");
    next();
} , async(req , res) => {
    const { name , iconUrl , adminId } = req.body;
    const newCategory = await prisma.roomCategory.create({ data : { name , iconUrl , adminId }});
    res.status(200).json({ newCategory })
})


export default categoryRouter;