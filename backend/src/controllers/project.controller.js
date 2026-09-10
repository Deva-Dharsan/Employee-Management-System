const projectRepo = require('../repositories/project.repository');

const createProject = async (req, res) => {
  try {
    const result = await projectRepo.createProject(req.body);
    if (result.error)
      return res.status(result.status).json({ result: false, message: result.error, data: null });

    return res.status(201).json({ result: true, message: 'Project created successfully', data: result.data });
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
    if (!project)
      return res.status(404).json({ result: false, message: 'Project not found', data: null });

    return res.status(200).json({ result: true, message: 'Project fetched successfully', data: project });
  } catch (error) {
    return res.status(500).json({ result: false, message: error.message, data: null });
  }
};

const updateProject = async (req, res) => {
  try {
    const result = await projectRepo.updateProject(req.query.id, req.body);
    if (result.error)
      return res.status(result.status).json({ result: false, message: result.error, data: null });

    return res.status(200).json({ result: true, message: 'Project updated successfully', data: result.data });
  } catch (error) {
    return res.status(500).json({ result: false, message: error.message, data: null });
  }
};

const deleteProject = async (req, res) => {
  try {
    const deleted = await projectRepo.remove(req.query.id);
    if (!deleted)
      return res.status(404).json({ result: false, message: 'Project not found', data: null });

    return res.status(200).json({ result: true, message: 'Project deleted successfully', data: null });
  } catch (error) {
    return res.status(500).json({ result: false, message: error.message, data: null });
  }
};

module.exports = { createProject, getAllProjects, getProjectById, updateProject, deleteProject };