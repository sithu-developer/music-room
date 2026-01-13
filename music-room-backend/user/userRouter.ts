import express from "express"
import { prisma } from "../util/prisma";

const userRouter = express.Router();

userRouter.get("/" , async(req , res) => {
    const { email } = req.body;
    if(!email) return res.status(400).send("Bad request")
    const createdUser = await prisma.user.create({ data : { email }});
    res.status(200).json({ createdUser })
})


export default userRouter;