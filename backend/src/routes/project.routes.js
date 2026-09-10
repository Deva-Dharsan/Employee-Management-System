const express = require('express');
const router = express.Router();
const { createProject, getAllProjects, getProjectById, updateProject, deleteProject } = require('../controllers/project.controller');

router.post('/CreateProject', createProject);
router.get('/GetAllProjects', getAllProjects);
router.get('/GetProjectById', getProjectById);
router.put('/UpdateProject', updateProject);
router.delete('/DeleteProject', deleteProject);

module.exports = router;
