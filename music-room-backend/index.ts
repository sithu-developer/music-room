import express, { Request, Response } from "express"
import cors from "cors"
import adminRouter from "./src/admin/adminRouter";
import { envValues } from "./util/envValues";
import categoryRouter from "./src/category/categoryRouter";
import roomImageRouter from "./src/room-image/roomImageRouter";
import musicRouter from "./src/music/musicRouter";
import userRouter from "./src/user/userRouter";
import roomRouter from "./src/room/roomRouter";
import roomMateRouter from "./src/room-mate/roomMateRouter";
import { createServer } from "http";
import { Server } from "socket.io"

const app = express();
const port = 5000;


// permission 
app.use(cors({
    origin : envValues.fontendUrl,
    methods : ["GET", "POST", "PUT", "DELETE"]
}))

// json body 
app.use(express.json())

const httpServer = createServer(app)

const io = new Server(httpServer , {
    cors : {
        origin : envValues.fontendUrl,
        methods : ["GET", "POST", "PUT", "DELETE"]
    }
})

io.on("connection" , (socket) => {
    console.log(`Socket server is connected by ${socket.id}`)

    socket.on("join_room" , (data) => {
        socket.join(String(data.roomId))
        console.log(`${socket.id} is join roomId : ${data.roomId}`)
    })

    socket.on("leave_room" , (data) => {
        socket.leave(String(data.roomId));
        console.log(`${socket.id} is leaved roomId : ${data.roomId}`)
    })

})

// attach io to req
app.use((req : Request , res : Response , next) => {
    req.io = io;
    next();
})

app.use("/admin" , adminRouter)
app.use("/category" , categoryRouter)
app.use("/room-image" , roomImageRouter )
app.use("/music" , musicRouter )
app.use("/user" , userRouter )
app.use("/room" , roomRouter);
app.use("/room-mate" , roomMateRouter)

httpServer.listen(port , () => console.log(`music-room-server is running on ${port}`))