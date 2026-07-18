import express from "express"
import cors from "cors"
import adminRouter from "./src/admin/adminRouter";
import { envValues } from "./util/envValues";
import categoryRouter from "./src/category/categoryRouter";
import roomImageRouter from "./src/room-image/roomImageRouter";
import musicRouter from "./src/music/musicRouter";
import userRouter from "./src/user/userRouter";
import roomRouter from "./src/room/roomRouter";
import roomMateRouter from "./src/room-mate/roomMateRouter";

const app = express();
const port = 5000;

// permission 
app.use(cors({
    origin : envValues.fontendUrl,
    methods : ["GET", "POST", "PUT", "DELETE"]
}))

// json body 
app.use(express.json())

app.use("/admin" , adminRouter)
app.use("/category" , categoryRouter)
app.use("/room-image" , roomImageRouter )
app.use("/music" , musicRouter )
app.use("/user" , userRouter )
app.use("/room" , roomRouter);
app.use("/room-mate" , roomMateRouter)

app.listen(port , () => console.log(`music-room-server is running on ${port}`))