const employeeRepo = require('../repositories/employee.repository');

const createEmployee = async (req, res) => {
  try {
    const alreadyExists = await employeeRepo.findByEmail(req.body.emailId);
    if (alreadyExists) {
      return res.status(400).json({
        result: false,
        message: 'Email already registered. Please use a different email.',
        data: null,
      });
    }

    const newEmployee = await employeeRepo.createWithHashedPassword(req.body);
    return res.status(201).json({
      result: true,
      message: 'Employee created successfully',
      data: newEmployee,
    });

  } catch (error) {
    return res.status(500).json({ result: false, message: error.message, data: null });
  }
};

const getAllEmployees = async (req, res) => {
  try {
    const employees = await employeeRepo.findAll();
    return res.status(200).json({
      result: true,
      message: 'Employees fetched successfully',
      data: employees,
    });
  } catch (error) {
    return res.status(500).json({ result: false, message: error.message, data: null });
  }
};

const getEmployeeById = async (req, res) => {
  try {
    const employee = await employeeRepo.findById(req.query.id);
    if (!employee) {
      return res.status(404).json({ result: false, message: 'Employee not found', data: null });
    }
    return res.status(200).json({
      result: true,
      message: 'Employee fetched successfully',
      data: employee,
    });
  } catch (error) {
    return res.status(500).json({ result: false, message: error.message, data: null });
  }
};

const updateEmployee = async (req, res) => {
  try {
    const updatedEmployee = await employeeRepo.updateWithHashedPassword(req.query.id, req.body);
    if (!updatedEmployee) {
      return res.status(404).json({ result: false, message: 'Employee not found', data: null });
    }
    return res.status(200).json({
      result: true,
      message: 'Employee updated successfully',
      data: updatedEmployee,
    });
  } catch (error) {
    return res.status(500).json({ result: false, message: error.message, data: null });
  }
};

const deleteEmployee = async (req, res) => {
  try {
    const deleted = await employeeRepo.remove(req.query.id);
    if (!deleted) {
      return res.status(404).json({ result: false, message: 'Employee not found', data: null });
    }
    return res.status(200).json({
      result: true,
      message: 'Employee deleted successfully',
      data: null,
    });
  } catch (error) {
    return res.status(500).json({ result: false, message: error.message, data: null });
  }
};

const loginEmployee = async (req, res) => {
  try {
    const { userName, password } = req.body;

    if (!userName || !password) {
      return res.status(400).json({
        result: false,
        message: 'Username and password are required',
        data: null,
      });
    }

    const employeeData = await employeeRepo.verifyCredentialsAndSign(userName, password);
    if (!employeeData) {
      return res.status(401).json({
        result: false,
        message: 'Invalid username or password',
        data: null,
      });
    }

    return res.status(200).json({
      result: true,
      message: 'Login successful',
      data: employeeData,
    });

  } catch (error) {
    return res.status(500).json({ result: false, message: error.message, data: null });
  }
};

module.exports = {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  loginEmployee,
};