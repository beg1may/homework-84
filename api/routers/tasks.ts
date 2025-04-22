import express from "express";
import {Error} from "mongoose";
import Task from "../models/Task";
import auth, {RequestWithUser} from "../middleware/auth";

const tasksRouter = express.Router();

tasksRouter.post("/", auth, async (req, res, next) => {
    try {
        const task = new Task ({
            user: req.body.user,
            title: req.body.title,
            description: req.body.description,
            status: req.body.status,
        });

        await task.save();
        res.send(task);
    } catch (error) {
        if(error instanceof  Error.ValidationError) {
            res.status(400).send(error);
            return;
        }

        next(error);
    }
});

tasksRouter.get("/", auth, async (req, res) => {
    const user = (req as RequestWithUser).user;
    const tasks = await Task.find({user: user._id});
    res.send(tasks);
});

export default tasksRouter;