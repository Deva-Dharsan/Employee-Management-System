const Project = require('../models/Project.model');

const findByCode = (code) =>
  Project.findOne({ projectCode: code });

const create = (data) =>
  Project.create(data);

const findAll = () =>
  Project.find().sort({ createdDate: -1 });

const findById = (id) =>
  Project.findById(id);

const update = (id, data) =>
  Project.findByIdAndUpdate(id, data, { new: true });

const remove = (id) =>
  Project.findByIdAndDelete(id);

module.exports = {
  findByCode,
  create,
  findAll,
  findById,
  update,
  remove,
};
