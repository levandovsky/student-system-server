import {getConnection} from "../database/mysql.js";

export default class User {
    constructor({id, name, lastname, email, password}) {
        this.id = id;
        this.name = name;
        this.lastname = lastname;
        this.email = email;
        this.password = password;
    }

    get fullName() {
        return `${this.name} ${this.lastname}`;
    }

    static async create({name, lastname, email, password}) {
        try {
            const connection = await getConnection();
            const query = `
                INSERT INTO users (name, lastname, email, password)
                VALUES (?, ?, ?, ?);
            `;
            const [{insertedId}] = await connection.query(query, [name, lastname, email, password]);

            return new User({id: insertedId, name, lastname, email, password});
        } catch (e) {
            console.log("Couldn't create user", e);
            throw e;
        }
    }

    static async all() {
        try {
            const connection = await getConnection();
            const query = "SELECT name, lastname, email FROM users";
            const [data] = await connection.query(query);
            return data.map(({name, lastname, email}) => new User(name, lastname, email));
        } catch (e) {
            console.log("Couldn't get all users", e);
            throw e;
        }
    }

    static async oneByEmail(email) {
        try {
            const connection = await getConnection();
            const query = "SELECT * FROM users WHERE email = ?";
            const [data] = await connection.query(query, [email]);
            const [user] = data;

            if (!user) return null;

            return new User({...user});
        } catch (e) {
            console.log(`Couldn't get user with email: ${email}`, e);
            throw e;
        }
    }

    static async init() {
        try {
            const connection = await getConnection();
            const query = `
                CREATE TABLE IF NOT EXISTS users (
                    id INTEGER AUTO_INCREMENT NOT NULL,
                    name VARCHAR(20) NOT NULL,
                    lastname VARCHAR(50) NOT NULL,
                    email VARCHAR (255) NOT NULL,
                    password VARCHAR (60) NOT NULL,
                    PRIMARY KEY (id),
                    UNIQUE (email)
                )
            `;

            await connection.query(query);

            console.log("Successfully created 'users' table");
        } catch (e) {
            console.log("Couldn't init user db", e);
            throw e;
        }
    }
}
