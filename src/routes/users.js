import {Router} from "express";
import {hash, compare} from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import {config} from "dotenv";

config();

const router = Router();

router.get("/", async (req, res) => {
    try {
        const users = await User.all();
        res.send(users);
    } catch (e) {
        res.status(500).send({
            error: e.message,
        });
    }
});

router.post("/", async (req, res) => {
    const {name, lastname, email, password} = req.body;
    const hashed = await hash(password, 10);

    try {
        const user = await User.create({name, lastname, email, password: hashed});

        res.status(201).send({
            user,
        });
    } catch (e) {
        res.status(500).send({
            error: e.message,
        });
    }
});

router.post("/login", async (req, res) => {
    const {email, password} = req.body;

    try {
        const user = await User.oneByEmail(email);

        const error = "Couldn't login";

        if (!user) {
            return res.status(403).send({
                error,
            });
        }

        const isValidPw = await compare(password, user.password);

        if (!isValidPw) {
            return res.status(403).send({
                error,
            });
        }

        console.log(user);

        const token = jwt.sign(
            {
                lecturerId: user.id,
            },
            process.env.TOKEN_SECRET
        );

        res.send({
            token,
        });
    } catch (e) {
        res.status(500).send({
            error: e.message,
        });
    }
});

export default router;
