import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import PostRouter from "./routes/Posts.js";
import GenerateImageRouter from "./routes/GenerateImage.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));

// error handler
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Something went wrong!";
  return res.status(status).json({
    success: false,
    status,
    message,
  });
});

app.use("/api/post", PostRouter);
app.use("/api/generateImage", GenerateImageRouter);

//Default get
app.get("/", async (req, res) => {
  res.status(200).json({
    message: "Hello user, welcome to the Image Generator API",
  });
});

//function to connect to mongodb
const connectDB = () => {
  mongoose.set("strictQuery", true);
  console.log("Connecting to MongoDB with URI:", process.env.MONGO_URI);
  mongoose
    .connect(process.env.MONGO_URI)
    .then (() => console.log("MongoDB Connected"))
    .catch((err) => {
      console.error("Failed to connect to DB");
      console.error(err);
    });
};

const startServer = async () => {
  try {
    connectDB();
    app.listen(8080, () => console.log("Server started on port 8080"));
  } catch (error) {
    //Error logs
    console.log(error);
  }
};

startServer();
