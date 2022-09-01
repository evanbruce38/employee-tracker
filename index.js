const inquirer = require('inquirer');
const mysql2 = require('mysql2');
require('console.table');

const connection = mysql2.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Rebels38?',
    database: 'tracker_db'
});

connection.connect(() => {
    inquirer.prompt({
    
    })
})