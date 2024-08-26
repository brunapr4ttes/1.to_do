import { Sequelize } from "sequelize"

const conn = new Sequelize("toDo3E", "root", "Sen@iDev77!.", {
    host: "localhost",
    dialect: "mysql"
})

//tstando conexão com o banco
// try {
//     await conn.authenticate();
//     console.log('Connection MYSQL');
// } catch (error) {
//     console.error('Error: ', error);
// }

export default conn;