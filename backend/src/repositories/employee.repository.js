const bcrypt   = require('bcrypt');
const jwt      = require('jsonwebtoken');
const Employee = require('../models/Employee.model');

const SALT_ROUNDS = 10;


const findByEmail = (email) =>
  Employee.findOne({ emailId: email });

const findAll = () =>
  Employee.find();

const findById = (id) =>
  Employee.findById(id);

const remove = (id) =>
  Employee.findByIdAndDelete(id);


const createWithHashedPassword = async (data) => {
  const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);
  return Employee.create({ ...data, password: hashedPassword });
};

const updateWithHashedPassword = async (id, data) => {
  const updateData = { ...data };
  if (updateData.password) {
    updateData.password = await bcrypt.hash(updateData.password, SALT_ROUNDS);
  }
  return Employee.findByIdAndUpdate(id, updateData, { new: true });
};

const verifyCredentialsAndSign = async (email, plainPassword) => {
  const employee = await Employee.findOne({ emailId: email });
  if (!employee) return null;

  const isMatch = await bcrypt.compare(plainPassword, employee.password);
  if (!isMatch) return null;

  const accessToken = jwt.sign(
    { id: employee._id, role: employee.role },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    { id: employee._id, role: employee.role },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '7d' }
  );

  // Save refresh token in DB
  employee.refreshToken = refreshToken;
  await employee.save();

  return { ...employee.toObject(), token: accessToken, refreshToken };
};

const verifyRefreshToken = async (token) => {
  try {
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    const employee = await Employee.findById(decoded.id);

    // Ensure the employee exists and the refresh token matches the one in DB
    if (!employee || employee.refreshToken !== token) {
      return null;
    }

    // Generate a new access token
    const newAccessToken = jwt.sign(
      { id: employee._id, role: employee.role },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    return { token: newAccessToken };
  } catch (err) {
    return null;
  }
};

const removeRefreshToken = async (employeeId) => {
  return Employee.findByIdAndUpdate(employeeId, { refreshToken: null });
};

module.exports = {
  findByEmail,
  findAll,
  findById,
  remove,
  createWithHashedPassword,
  updateWithHashedPassword,
  verifyCredentialsAndSign,
  verifyRefreshToken,
  removeRefreshToken,
};