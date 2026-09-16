const bcrypt      = require('bcrypt');
const jwt         = require('jsonwebtoken');
const employeeRepo = require('../repositories/employee.repository');

const SALT_ROUNDS = 10;

const createEmployee = async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const alreadyExists = await employeeRepo.findByEmail(emailId);
    if (alreadyExists) {
      return res.status(400).json({
        result: false,
        message: 'Email already registered. Please use a different email.',
        data: null,
      });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const newEmployee = await employeeRepo.create({
      ...req.body,
      password: hashedPassword,
    });

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
    const updateData = { ...req.body };

    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, SALT_ROUNDS);
    }

    const updatedEmployee = await employeeRepo.update(req.query.id, updateData);
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

    const employee = await employeeRepo.findByEmail(userName);
    if (!employee) {
      return res.status(401).json({
        result: false,
        message: 'Invalid username or password',
        data: null,
      });
    }

    const isMatch = await bcrypt.compare(password, employee.password);
    if (!isMatch) {
      return res.status(401).json({
        result: false,
        message: 'Invalid username or password',
        data: null,
      });
    }

    const token = jwt.sign(
      { id: employee._id, role: employee.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    const employeeData = { ...employee.toObject(), token };
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