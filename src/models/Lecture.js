import {getConnection} from "../database/mysql.js";

export default class Lecture {
    constructor(title) {
        this.title = title;
    }

    static async create({title, lecturerId}) {
        try {
            const connection = await getConnection();
            const query = "INSERT INTO lectures (title, lecturerId) VALUES (?, ?);";

            await connection.query(query, [title, lecturerId]);

            return new Lecture(title);
        } catch (e) {
            console.log("Couldn't create a lecture", e);
            throw e;
        }
    }

    static async getAllByLecturerId(id) {
        try {
            const connection = await getConnection();
            const query = "SELECT * FROM lectures WHERE lecturerId = ?";
            console.log({id});

            const [data] = await connection.query(query, [id]);
            return data.map(({title}) => new Lecture(title));
        } catch (e) {
            console.log("Couldn't get all lectures", e);
            throw e;
        }
    }

    static async init() {
        try {
            const connection = await getConnection();
            const query = `
                CREATE TABLE IF NOT EXISTS lectures (
                    id INTEGER AUTO_INCREMENT NOT NULL,
                    title VARCHAR(20) NOT NULL,
                    lecturerId INTEGER NOT NULL,
                    PRIMARY KEY (id),
                    FOREIGN KEY (lecturerId) REFERENCES users (id)
                )
            `;

            await connection.query(query);

            console.log("Successfully created 'lectures' table");
        } catch (e) {
            console.log("Couldn't init 'lectures' db", e);
            throw e;
        }
    }
}
