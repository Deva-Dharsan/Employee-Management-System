const Employee = require('../models/Employee.model');


const findByEmail = (email) =>
  Employee.findOne({ emailId: email });


const create = (data) =>
  Employee.create(data);


const findAll = () =>
  Employee.find();


const findById = (id) =>
  Employee.findById(id);

const update = (id, data) =>
  Employee.findByIdAndUpdate(id, data, { new: true });

const remove = (id) =>
  Employee.findByIdAndDelete(id);

module.exports = {
  findByEmail,
  create,
  findAll,
  findById,
  update,
  remove,
};