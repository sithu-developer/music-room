import express from "express"
import { prisma } from "../../util/prisma";
import { Request, Response } from "express";

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

categoryRouter.delete("/" , (req : Request , res : Response , next ) => {
    const id = Number(req.query.id);
    if(!id) return res.status(400).send("Bad request")
    next();
} , async( req : Request , res : Response ) => {
    const id = Number(req.query.id);
    const deletedCategory = await prisma.roomCategory.delete({ where : { id } });
    res.status(200).json({ deletedCategory })
})

categoryRouter.put("/" , (req , res , next) => {
    const { id , name , iconUrl } = req.body;
    const isValid = id && name && iconUrl;
    if(!isValid) return res.status(400).send("Bad request");
    next();
} , async( req , res ) => {
    const { id , name , iconUrl } = req.body;
    const updatedCategory = await prisma.roomCategory.update({ where : { id } , data : { name , iconUrl }});
    res.status(200).json({ updatedCategory });
})


export default categoryRouter;