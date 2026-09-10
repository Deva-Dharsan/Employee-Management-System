const assignmentRepo = require("../repositories/assignment.repository");

const createAssignment = async (req, res) => {
  try {
    const { employeeId, projectId, allocation, startDate, endDate } = req.body;

    if (new Date(startDate) > new Date(endDate)) {
      return res
        .status(400)
        .json({
          result: false,
          message: "Start date must be on or before end date.",
          data: null,
        });
    }

    if (allocation < 1 || allocation > 100) {
      return res
        .status(400)
        .json({
          result: false,
          message: "Allocation must be between 1 and 100.",
          data: null,
        });
    }

    const duplicate = await assignmentRepo.findDuplicate(employeeId, projectId);
    if (duplicate) {
      return res
        .status(400)
        .json({
          result: false,
          message:
            "Employee already has an active/planned assignment for this project.",
          data: null,
        });
    }

    const activeAssignments =
      await assignmentRepo.findActiveByEmployee(employeeId);
    const totalAllocation = activeAssignments.reduce(
      (sum, a) => sum + a.allocation,
      0,
    );
    if (totalAllocation + Number(allocation) > 100) {
      return res.status(400).json({
        result: false,
        message: `Employee allocation cannot exceed 100%. Current active allocation: ${totalAllocation}%, requested: ${allocation}%.`,
        data: null,
      });
    }

    const newAssignment = await assignmentRepo.create(req.body);
    return res
      .status(201)
      .json({
        result: true,
        message: "Assignment created successfully",
        data: newAssignment,
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
    if (!assignment) {
      return res
        .status(404)
        .json({ result: false, message: "Assignment not found", data: null });
    }
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
    const { allocation, startDate, endDate, employeeId } = req.body;
    const currentId = req.query.id;

    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      return res
        .status(400)
        .json({
          result: false,
          message: "Start date must be on or before end date.",
          data: null,
        });
    }

    if (allocation !== undefined && (allocation < 1 || allocation > 100)) {
      return res
        .status(400)
        .json({
          result: false,
          message: "Allocation must be between 1 and 100.",
          data: null,
        });
    }

    if (allocation !== undefined && employeeId) {
      const activeAssignments = await assignmentRepo.findActiveByEmployee(
        employeeId,
        currentId,
      );
      const totalAllocation = activeAssignments.reduce(
        (sum, a) => sum + a.allocation,
        0,
      );
      if (totalAllocation + Number(allocation) > 100) {
        return res.status(400).json({
          result: false,
          message: `Employee allocation cannot exceed 100%. Current allocation from other projects: ${totalAllocation}%, requested: ${allocation}%.`,
          data: null,
        });
      }
    }

    const updated = await assignmentRepo.update(currentId, req.body);
    if (!updated) {
      return res
        .status(404)
        .json({ result: false, message: "Assignment not found", data: null });
    }
    return res
      .status(200)
      .json({
        result: true,
        message: "Assignment updated successfully",
        data: updated,
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
    if (!deleted) {
      return res
        .status(404)
        .json({ result: false, message: "Assignment not found", data: null });
    }
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
