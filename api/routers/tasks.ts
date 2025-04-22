import express from "express";
import {deleteModel, Error} from "mongoose";
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

tasksRouter.put("/:id", auth, async (req, res, next) => {
    const user = (req as RequestWithUser).user;
    const id = req.params.id;
    try {
        const task = await Task.findOne({_id: id, user: user._id});

        if (!task) {
            res.status(403).send({error: 'You cannot edit just your task'});
            return;
        }

        const taskUpdate = await Task.findOneAndUpdate(
            {_id: id}, {
                title: req.body.title,
                description: req.body.description,
                status: req.body.status
            },
            { new: true, runValidators: true}
            );

        res.send(taskUpdate);
    } catch (error) {
        if(error instanceof  Error.ValidationError) {
            res.status(400).send(error);
            return;
        }

        next(error);
    }
});

tasksRouter.delete("/:id", auth, async (req, res, next) => {
    const user = (req as RequestWithUser).user;
    const id = req.params.id;
    try {
        const task = await Task.findOne({_id: id, user: user._id});

        if (!task) {
            res.status(403).send({error: 'You cannot delete just your task'});
            return;
        }

        await Task.deleteOne({_id: id});
        res.send({message: 'Task deleted'});
    } catch (error) {
        next(error);
    }
})

export default tasksRouter;