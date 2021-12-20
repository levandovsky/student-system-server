import {Router} from "express";
import isLoggedIn from "../middleware/isLoggedIn.js";
import Lecture from "../models/Lecture.js";

const router = Router();

router.get("/", isLoggedIn, async (req, res) => {
    try {
        const {lecturerId} = req.token;
        const lectures = await Lecture.getAllByLecturerId(lecturerId);
        res.send({
            lectures,
        });
    } catch (e) {
        res.status(500).send({
            error: e.message,
        });
    }
});

router.post("/", isLoggedIn, async (req, res) => {
    try {
        const {title} = req.body;
        const {lecturerId} = req.token;

        const lecture = await Lecture.create({title, lecturerId});

        res.send({
            lecture,
        });
    } catch (e) {
        res.status(500).send({
            error: e.message,
        });
    }
});

export default router;
