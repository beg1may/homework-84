import express from "express";
import User from "../models/User";
import {Error} from "mongoose";

const usersRouter = express.Router();

usersRouter.post("/", async (req, res, next) => {
    try {
        const user = new User({
            username: req.body.username,
            password: req.body.password,
        });

        user.generateToken();
        await user.save();
        res.send({
            username: user.username,
            token: user.token
        });
    } catch (error) {
        if(error instanceof  Error.ValidationError) {
            res.status(400).send(error);
            return;
        }
        next(error);
    }
});

usersRouter.post("/sessions", async (req, res, next) => {
    if(!req.body.username || !req.body.password) {
        res.status(400).send("Username and password are required");
        return;
    }

    const user = await User.findOne({username: req.body.username});

    if(!user) {
        res.status(400).send('Username not found');
        return;
    }

    const isMath = await user.checkPassword(req.body.password);

    if(!isMath) {
        res.status(400).send({error: "Password in incorrect"});
        return;
    }

    user.generateToken();
    await user.save();

    res.send({
        username: user.username,
        token: user.token,
    })

})

export default usersRouter;