import express from "express";
import {createConnection} from "mysql2/promise";
import {config} from "dotenv";
import User from "./models/User.js";
import Lecture from "./models/Lecture.js";
import usersRouter from "./routes/users.js";
import lecturesRouter from "./routes/lectures.js";

config();

const main = async () => {
    const {MYSQL_HOST, MYSQL_PORT, MYSQL_USER, MYSQL_PW, MYSQL_DB} = process.env;

    const connection = await createConnection({
        host: MYSQL_HOST,
        port: MYSQL_PORT,
        user: MYSQL_USER,
        password: MYSQL_PW,
        database: MYSQL_DB,
    });

    await User.init();
    await Lecture.init();

    const app = express();

    app.use(express.json());

    app.sql = connection;

    app.use("/users", usersRouter);

    app.use("/lectures", lecturesRouter);

    app.listen(8080, () => {
        console.log("http://localhost:8080");
    });
};

main();
