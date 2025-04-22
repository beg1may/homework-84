import express from "express";
import {Error} from "mongoose";
import Task from "../models/Task";
import auth from "../middleware/auth";

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

export default tasksRouter;