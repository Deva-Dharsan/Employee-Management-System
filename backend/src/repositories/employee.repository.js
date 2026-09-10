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

  const token = jwt.sign(
    { id: employee._id, role: employee.role },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  return { ...employee.toObject(), token };
};

module.exports = {
  findByEmail,
  findAll,
  findById,
  remove,
  createWithHashedPassword,
  updateWithHashedPassword,
  verifyCredentialsAndSign,
};