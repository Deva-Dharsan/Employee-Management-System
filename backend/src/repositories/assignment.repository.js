const Assignment = require('../models/Assignment.model');

const findDuplicate = (employeeId, projectId) =>
  Assignment.findOne({
    employeeId,
    projectId,
    status: { $in: ['Planned', 'Active'] },
  });

const findActiveByEmployee = (employeeId, excludeId = null) => {
  const query = { employeeId, status: { $in: ['Planned', 'Active'] } };
  if (excludeId) query._id = { $ne: excludeId };
  return Assignment.find(query);
};

const create = (data) =>
  Assignment.create(data);

const findAll = () =>
  Assignment.find().sort({ createdDate: -1 });

const findById = (id) =>
  Assignment.findById(id);

const update = (id, data) =>
  Assignment.findByIdAndUpdate(id, data, { new: true });

const remove = (id) =>
  Assignment.findByIdAndDelete(id);

const findByProject = (projectId) =>
  Assignment.find({ projectId });

const findByEmployee = (employeeId) =>
  Assignment.find({ employeeId });

module.exports = {
  findDuplicate,
  findActiveByEmployee,
  create,
  findAll,
  findById,
  update,
  remove,
  findByProject,
  findByEmployee,
};
