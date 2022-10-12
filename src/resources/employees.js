const express = require('express');
const fs = require('fs');

const employees = require('../data/employees.json');

const router = express.Router();

router.get('/', (req, res) => {
  res.send(employees);
});

router.get('/getById/:id', (req, res) => {
  const employeeId = req.params.id;
  const checkEmployee = employees.find((employee) => employee.id === employeeId);
  if (checkEmployee) {
    res.send(checkEmployee);
  } else {
    res.send(`Employee with the Id ${employeeId} NOT FOUND`);
  }
});

router.delete('/delete/:id', (req, res) => {
  const employeeId = req.params.id;
  const foundEmployee = employees.find((employee) => employee.id === employeeId);
  const filteredEmployee = employees.filter((employee) => employee.id !== employeeId);
  if (!foundEmployee) {
    res.send(`Employee with the Id ${employeeId} NOT FOUND`);
  } else {
    fs.writeFile('src/data/employees.json', JSON.stringify(filteredEmployee), (err) => {
      if (err) {
        res.send('Error trying to delete employee');
      } else {
        res.send(`Employee deleted ${foundEmployee.name}`);
      }
    });
  }
});
router.post('/add', (req, res) => {
  const validKeys = ['id', 'name', 'lastName', 'phone', 'email', 'password'];
  const newEmployee = req.body;
  const newEmployeeKeys = Object.keys(newEmployee);
  const existEmployee = employees.find((employee) => employee.id === newEmployee.id);
  if (newEmployeeKeys.length < 6) {
    res.send('Please complete all fields');
  } else if (newEmployeeKeys.join('') === validKeys.join('')) {
    if (!existEmployee) {
      employees.push(newEmployee);
      fs.writeFile('src/data/employees.json', JSON.stringify(employees), (err) => {
        if (err) {
          res.send('New employee not saved.');
        } else {
          res.send(`Employee created successfully: ${JSON.stringify(newEmployee, null, 4)}`);
        }
      });
    } else {
      res.send('The employee already exists!');
    }
  } else {
    res.send('Fields for new user must be "ID, name, last name, phone, email and password".');
  }
});

router.put('/edit', (req, res) => {
  let dataError = 0;
  const editEmployee = req.body;
  const oldEmployee = employees.find((employee) => employee.id === editEmployee.id);
  if (!oldEmployee) {
    res.send('The employee does not exist.');
  } else {
    if (oldEmployee.name === editEmployee.name) {
      dataError += 1;
    } else {
      oldEmployee.name = editEmployee.name;
    }
    if (oldEmployee.lastName === editEmployee.lastName) {
      dataError += 1;
    } else {
      oldEmployee.lastName = editEmployee.lastName;
    }
    if (oldEmployee.phone === editEmployee.phone) {
      dataError += 1;
    } else {
      oldEmployee.phone = editEmployee.phone;
    }
    if (oldEmployee.email === editEmployee.email) {
      dataError += 1;
    } else {
      oldEmployee.email = editEmployee.email;
    }
    if (oldEmployee.password === editEmployee.password) {
      dataError += 1;
    } else {
      oldEmployee.password = editEmployee.password;
    }
    if (dataError === 5) {
      res.send('New employee data is the same as previous!');
    } else {
      fs.writeFile('src/data/employees.json', JSON.stringify(employees), (err) => {
        if (err) {
          res.send('Could not edit user.');
        } else {
          res.send('User edited successfully.');
        }
      });
    }
  }
});

module.exports = router;
