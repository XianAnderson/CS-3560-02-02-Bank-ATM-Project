const mysql2 = require('mysql2');

const dbconnect = () => {
    const db = mysql2.createConnection({
        host: "localhost",
        user: "root",
        password: "0207LikeAShark2002!",
        database: "useraccounts",
    });
    return db
};
  
module.exports = { dbconnect };