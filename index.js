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
    console.log('database connected');
});

const mainPrompt = () => {
    inquirer.prompt({
    type: 'list',
    name: 'action',
    message: 'What would you like to do?',
    choices: ['view all departments', 'view all roles', 'add a department', 'add a role', 'add an employee', 'update an employee role', 'exit the application']
})
.then((answers) => {
    switch(answers.action){
        case 'view all departments':
            viewDepartments();
            break;
        case 'view all roles':
            viewRoles();
            break;
        case 'view all employees':
            viewEmployees();
            break;
        case 'add a department':
            addDepartment();
            break;
        case 'add a role':
            addRole();
            break;
        case 'add an employee':
            addEmployee();
            break;
        case 'update an employee role':
            updateRole();
            break;
        case 'exit the application':
            console.log('See you later!')
            process.exit(0);
        };
    });
};

const viewDepartments = () => {
    const sql = `SELECT * FROM department`

    connection.query(sql, (err, res) => {
        if (err) console.log({ error: err.message });
        console.table(res);
        mainPrompt();
    });
}

const viewRoles = () => {
    const sql = `SELECT role.id AS role_id, role.title AS job_title, role.salary, department.name AS department
                 FROM role
                 LEFT JOIN department ON role.department_id = department_id`;

    connection.query(sql, (err, res) => {
        if (err) console.log({ error: err.message });
        console.table(res);
        mainPrompt();
    });
}

const viewEmployees = () => {
    const sql = `SELECT employee.id, employee.first_name, employee.last_name, role.title AS job_title, department.name AS department, role.salary AS salary, employee.manager_id AS manager
    FROM employee
    LEFT JOIN employee m ON employee.manager_id = m.id
    LEFT JOIN role ON employee.role_id = role.id
    LEFT JOIN department ON role.department_id = department.id`;

    connection.query(sql, (err, res) => {
        if (err) console.log({error: err.message});
        console.table(res);
        mainPrompt();
    });
}

function addDepartment() {
    return inquirer.prompt([{
        type: 'imput',
        name: 'name',
        message: 'What is the name of this department?'
    }
])
.then(res => {
    console.log(res);
    const sql = 'INSERT INTO department SET ?';

    connection.query(sql, res, function(err, result) {
        if (err) throw err;
        console.log('Department added!')
        mainPrompt();
    });
});
};

function addRole() {
    return inquirer.prompt([{
        type: 'input',
        name: 'title',
        message: 'What is the name of this role?'
    },
    {
        type: 'input',
        name: 'salary',
        message: 'What is the salary for this role?'
    },
    {
        type: 'list',
        name: 'department',
        message: 'What department does this role belong to?',
        choices: ['Sales', 'Engineering', 'Finance', 'Legal']
    }
])
.then(res => {
    console.log(res);
    const deptIds = [
        {
            name: 'sales',
            id: 1
        },
        {
            name: 'Engineering',
            id: 2
        },
        {
            name: 'Finance',
            id: 3
        },
        {
            name: 'Legal',
            id: 4
        }
    ]
    const deptObj = deptIds.find(d => d.name.toLowerCase() == res.department.toLowerCase())

    res.department_id = deptObj.id;
    delete res.department;

    res.salary = parseFloat(res.salary);

    const sql = 'INSERT INTO role SET ?';

    connection.query(sql, res, function(err, result) {
        if (err) throw err;
        console.log('Role added!')
        mainPrompt();
    });
});
};

function addEmployee() {
    return inquirer.prompt([{
        type: 'input',
        name: 'first_name',
        message: 'What is the first name of this employee?'
    },
    {
        type: 'input',
        name: 'last_name',
        message: 'What is the last name of this employee?'
    },
    {
        type: 'list',
        name: 'role',
        message: 'What is the role of this employee?',
        choices: ['Salesperson', 'Sofftware Engineer', 'Accountant', 'Lawyer']
    },
    {
        type: 'list',
        name: 'manager_id',
        message: 'Who is the manager of this employee?',
        choices: ['Nick Saban', 'Brian Kelly', 'Sam Pittmam', 'Lane Kiffin']
    }
])
.then(res => {
    console.log(res);
    const roleIds = [
        {
            name: 'salesperson',
            id: 2
        },
        {
            name: 'Software Engineer',
            id: 4
        },
        {
            name: 'Accountant',
            id: 6
        },
        {
            name: 'Lawyer',
            id: 8
        }
    ]
    const roleObj = roleIds.find(r => r.name.toLowerCase() == res.role.toLowerCase())

    res.role_id = roleObj.id;
    delete res.role;

    const managerIds = [
        {
            name: 'Nick Saban',
            id: 1
        },
        {
            name: 'Brian Kelly',
            id: 3
        },
        {
            name: 'Sam Pittman',
            id: 5
        },
        {
            name: 'Lane Kiffin',
            id: 7
        }
    ]

const managerObj = managerIds.find(m => m.name.toLowerCase() == res.manager_id.toLowerCase())

    res.manager_id = managerObj.id;
    delete res.manager;

    const sql = 'INSERT INTO employee SET ?';
    connection.query(sql, res, function(err, result) {
        if (err) throw err;
        console.log('Employee added!')
        mainPrompt();
    });
});
};