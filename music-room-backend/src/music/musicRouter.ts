import express, { Request, Response } from "express"
import { prisma } from "../../util/prisma";

const musicRouter = express.Router();

musicRouter.post("/" , ( req : Request , res : Response , next ) => {
    const { name , musicUrl , adminId , userId } = req.body;
    const isValid = name && musicUrl;
    if(!isValid || !(adminId || userId)) return res.status(400).send("Bad request");
    next();
} , async( req : Request , res : Response ) => {
    const { name , musicUrl , adminId , userId } = req.body;
    const newMusic = await prisma.music.create({ data : { name , musicUrl , adminId , userId } });
    return res.status(200).json({ newMusic })
})

musicRouter.put("/" , async( req : Request , res : Response , next ) => {
    const { id , name , musicUrl } = req.body;
    const isValid = id && name && musicUrl;
    if(!isValid) return res.status(400).send("Bad request");
    const isExit = await prisma.music.findUnique({ where : { id }})
    if(!isExit) return res.status(400).send("Bad request");
    next();
} , async( req : Request , res : Response ) => {
    const { id , name , musicUrl } = req.body;
    const updatedMusic = await prisma.music.update({ where : { id } , data : { name , musicUrl }});
    return res.status(200).json({ updatedMusic });
})

musicRouter.delete("/" , async( req : Request , res : Response , next ) => {
    const id = Number(req.query.id);
    if(!id) return res.status(400).send("Bad request");
    const isExit = await prisma.music.findUnique({ where : { id }})
    if(!isExit) return res.status(400).send("Bad request");
    next();
} , async( req : Request , res : Response , next ) => {
    const id = Number(req.query.id);
    await prisma.music.delete({ where : { id }});
    return res.status(200).json({ deletedMusicId : id })
})

export default musicRouter;