import express from "express"
import userRouter from "./user/userRouter";

const app = express();
const port = 5000;


app.use("/user" , userRouter)

app.listen(port , () => console.log(`music-room-server is running on ${port}`))