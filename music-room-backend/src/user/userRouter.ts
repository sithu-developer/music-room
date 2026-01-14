import express from "express"
import { prisma } from "../../util/prisma";

const userRouter = express.Router();

userRouter.post("/" , (req , res , next) => {
    const { email } = req.body;
    if(!email) return res.status(400).send("Bad request");
    next();
} , async(req , res) => {
    const { email } = req.body;
    const isExit = await prisma.user.findUnique({ where : { email }});
    if(isExit) return res.status(200).json({ createdUser : isExit });
    const createdUser = await prisma.user.create({ data : { email }});
    res.status(200).json({ createdUser });
})


export default userRouter;