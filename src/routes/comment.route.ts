// routes/commentRoutes.ts
import express from "express";
import CommentController from "../controllers/comment.controller";

const router = express.Router();

//@ts-ignore
router.post("/comments/:video_id", CommentController.addComment);

export default router;
