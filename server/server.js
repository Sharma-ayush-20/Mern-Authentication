import express from "express";
import 'dotenv/config';
import cors from "cors"
import cookieParser from "cookie-parser";
import connectDB from "./config/mongodb.js";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";

const app = express();
const PORT = process.env.PORT || 4000;

const allowedOrigins = ['http://localhost:5173']

app.use(cors({
    credentials: true,
    origin: allowedOrigins,
}));
app.use(cookieParser());
app.use(express.json());

//API Endpoints
app.get("/", (req, res) => {
    res.send("Hi Developer")
})
app.use('/api/auth', authRouter)
app.use('/api/user', userRouter)

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`App is listening at http://localhost:${PORT}`)
    })
}).catch((error) => {
    console.log("Error: ", error.message)
})

