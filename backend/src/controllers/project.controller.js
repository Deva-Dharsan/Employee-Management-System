const projectRepo = require('../repositories/project.repository');

const createProject = async (req, res) => {
  try {
    const { projectCode, startDate, endDate } = req.body;

    const existing = await projectRepo.findByCode(projectCode);
    if (existing) {
      return res.status(400).json({ result: false, message: 'Project code already exists.', data: null });
    }

    if (new Date(startDate) > new Date(endDate)) {
      return res.status(400).json({ result: false, message: 'Start date must be on or before end date.', data: null });
    }

    const newProject = await projectRepo.create(req.body);
    return res.status(201).json({ result: true, message: 'Project created successfully', data: newProject });

  } catch (error) {
    return res.status(500).json({ result: false, message: error.message, data: null });
  }
};

const getAllProjects = async (req, res) => {
  try {
    const projects = await projectRepo.findAll();
    return res.status(200).json({ result: true, message: 'Projects fetched successfully', data: projects });
  } catch (error) {
    return res.status(500).json({ result: false, message: error.message, data: null });
  }
};

const getProjectById = async (req, res) => {
  try {
    const project = await projectRepo.findById(req.query.id);
    if (!project) {
      return res.status(404).json({ result: false, message: 'Project not found', data: null });
    }
    return res.status(200).json({ result: true, message: 'Project fetched successfully', data: project });
  } catch (error) {
    return res.status(500).json({ result: false, message: error.message, data: null });
  }
};

const updateProject = async (req, res) => {
  try {
    const { startDate, endDate } = req.body;
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      return res.status(400).json({ result: false, message: 'Start date must be on or before end date.', data: null });
    }

    const updated = await projectRepo.update(req.query.id, req.body);
    if (!updated) {
      return res.status(404).json({ result: false, message: 'Project not found', data: null });
    }
    return res.status(200).json({ result: true, message: 'Project updated successfully', data: updated });
  } catch (error) {
    return res.status(500).json({ result: false, message: error.message, data: null });
  }
};

const deleteProject = async (req, res) => {
  try {
    const deleted = await projectRepo.remove(req.query.id);
    if (!deleted) {
      return res.status(404).json({ result: false, message: 'Project not found', data: null });
    }
    return res.status(200).json({ result: true, message: 'Project deleted successfully', data: null });
  } catch (error) {
    return res.status(500).json({ result: false, message: error.message, data: null });
  }
};

module.exports = { createProject, getAllProjects, getProjectById, updateProject, deleteProject };