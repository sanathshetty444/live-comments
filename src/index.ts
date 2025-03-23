import express, { Request, Response } from "express";
import commentRoutes from "./routes/comment.route";

const app = express();
const port = 8888;
app.use(express.json());

app.use("/", commentRoutes);

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
