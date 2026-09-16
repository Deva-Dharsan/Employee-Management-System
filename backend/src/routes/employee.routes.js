const express = require("express");
const router = express.Router();
const {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  loginEmployee,
} = require("../controllers/employee.controller");
const {
  validateCreateEmployee,
  validateUpdateEmployee,
} = require("../validators/employee.validator");

router.post("/CreateEmployee", validateCreateEmployee, createEmployee);

router.get("/GetAllEmployees", getAllEmployees);

router.get("/GetEmployeeById", getEmployeeById);

router.put("/UpdateEmployee", validateUpdateEmployee, updateEmployee);

router.delete("/DeleteEmployee", deleteEmployee);

router.post("/login", loginEmployee);

module.exports = router;