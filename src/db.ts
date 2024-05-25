// import mysql, { Pool } from "mysql2/promise";
// export const pool: Pool = mysql.createPool({
//     connectionLimit: 10,
//     host: "localhost",
//     user: "root",
//     password: "api",
//     database: "jobber_auth",
//     port: 3306,
//     multipleStatements: true,
// });
// pool.getConnection()
//     .then((connection) => {
//         console.log("Database connected");
//         connection.release();
//     })
//     .catch((error) => {
//         console.error("Failed to connect to the database:", error);
//     });
import { Sequelize } from "sequelize";
export const sequelize = new Sequelize(
    "jobber_auth",
    "root",
    "api",
    {
        dialect: "mysql",
        host: "localhost",
        port: 3306,
    }
);

