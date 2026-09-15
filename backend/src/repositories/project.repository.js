const Project = require('../models/Project.model');


const findAll = () =>
  Project.find().sort({ createdDate: -1 });

const findById = (id) =>
  Project.findById(id);

const remove = (id) =>
  Project.findByIdAndDelete(id);


const createProject = async (data) => {
  const { projectCode, startDate, endDate } = data;

  const existing = await Project.findOne({ projectCode });
  if (existing) return { error: 'Project code already exists.', status: 400 };

  if (new Date(startDate) > new Date(endDate))
    return { error: 'Start date must be on or before end date.', status: 400 };

  const newProject = await Project.create(data);
  return { data: newProject };
};

const updateProject = async (id, data) => {
  const { startDate, endDate } = data;

  if (startDate && endDate && new Date(startDate) > new Date(endDate))
    return { error: 'Start date must be on or before end date.', status: 400 };

  const updated = await Project.findByIdAndUpdate(id, data, { new: true });
  if (!updated) return { error: 'Project not found.', status: 404 };

  return { data: updated };
};

module.exports = {
  findAll,
  findById,
  remove,
  createProject,
  updateProject,
};
