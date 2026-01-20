import express from "express"
import cors from "cors"
import adminRouter from "./src/admin/adminRouter";
import { envValues } from "./util/envValues";
import categoryRouter from "./src/category/categoryRouter";

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

app.listen(port , () => console.log(`music-room-server is running on ${port}`))