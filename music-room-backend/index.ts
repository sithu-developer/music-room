import express from "express"
import cors from "cors"
import userRouter from "./src/user/userRouter";
import { envValues } from "./util/envValues";

const app = express();
const port = 5000;

// permission 
app.use(cors({
    origin : envValues.fontendUrl,
    methods : ["GET", "POST", "PUT", "DELETE"]
}))

// json body 
app.use(express.json())

app.use("/user" , userRouter)

app.listen(port , () => console.log(`music-room-server is running on ${port}`))