const express = require('express');
const router = express.Router();
const {
  createAssignment,
  getAllAssignments,
  getAssignmentById,
  updateAssignment,
  deleteAssignment,
  getAssignmentsByProject,
  getAssignmentsByEmployee,
} = require('../controllers/assignment.controller');

router.post('/CreateAssignment', createAssignment);
router.get('/GetAllAssignments', getAllAssignments);
router.get('/GetAssignmentById', getAssignmentById);
router.put('/UpdateAssignment', updateAssignment);
router.delete('/DeleteAssignment', deleteAssignment);
router.get('/GetAssignmentsByProject', getAssignmentsByProject);
router.get('/GetAssignmentsByEmployee', getAssignmentsByEmployee);

module.exports = router;
