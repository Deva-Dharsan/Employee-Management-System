const assignmentRepo = require("../repositories/assignment.repository");

const createAssignment = async (req, res) => {
  try {
    const result = await assignmentRepo.createAssignment(req.body);
    if (result.error)
      return res
        .status(result.status)
        .json({ result: false, message: result.error, data: null });

    return res
      .status(201)
      .json({
        result: true,
        message: "Assignment created successfully",
        data: result.data,
      });
  } catch (error) {
    return res
      .status(500)
      .json({ result: false, message: error.message, data: null });
  }
};

const getAllAssignments = async (req, res) => {
  try {
    const assignments = await assignmentRepo.findAll();
    return res
      .status(200)
      .json({
        result: true,
        message: "Assignments fetched successfully",
        data: assignments,
      });
  } catch (error) {
    return res
      .status(500)
      .json({ result: false, message: error.message, data: null });
  }
};

const getAssignmentById = async (req, res) => {
  try {
    const assignment = await assignmentRepo.findById(req.query.id);
    if (!assignment)
      return res
        .status(404)
        .json({ result: false, message: "Assignment not found", data: null });

    return res
      .status(200)
      .json({
        result: true,
        message: "Assignment fetched successfully",
        data: assignment,
      });
  } catch (error) {
    return res
      .status(500)
      .json({ result: false, message: error.message, data: null });
  }
};

const updateAssignment = async (req, res) => {
  try {
    const result = await assignmentRepo.updateAssignment(
      req.query.id,
      req.body,
    );
    if (result.error)
      return res
        .status(result.status)
        .json({ result: false, message: result.error, data: null });

    return res
      .status(200)
      .json({
        result: true,
        message: "Assignment updated successfully",
        data: result.data,
      });
  } catch (error) {
    return res
      .status(500)
      .json({ result: false, message: error.message, data: null });
  }
};

const deleteAssignment = async (req, res) => {
  try {
    const deleted = await assignmentRepo.remove(req.query.id);
    if (!deleted)
      return res
        .status(404)
        .json({ result: false, message: "Assignment not found", data: null });

    return res
      .status(200)
      .json({
        result: true,
        message: "Assignment deleted successfully",
        data: null,
      });
  } catch (error) {
    return res
      .status(500)
      .json({ result: false, message: error.message, data: null });
  }
};

const getAssignmentsByProject = async (req, res) => {
  try {
    const assignments = await assignmentRepo.findByProject(req.query.projectId);
    return res
      .status(200)
      .json({
        result: true,
        message: "Assignments fetched successfully",
        data: assignments,
      });
  } catch (error) {
    return res
      .status(500)
      .json({ result: false, message: error.message, data: null });
  }
};

const getAssignmentsByEmployee = async (req, res) => {
  try {
    const assignments = await assignmentRepo.findByEmployee(
      req.query.employeeId,
    );
    return res
      .status(200)
      .json({
        result: true,
        message: "Assignments fetched successfully",
        data: assignments,
      });
  } catch (error) {
    return res
      .status(500)
      .json({ result: false, message: error.message, data: null });
  }
};

module.exports = {
  createAssignment,
  getAllAssignments,
  getAssignmentById,
  updateAssignment,
  deleteAssignment,
  getAssignmentsByProject,
  getAssignmentsByEmployee,
};
