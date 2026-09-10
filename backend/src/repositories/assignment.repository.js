const Assignment = require('../models/Assignment.model');

// ── Mongoose queries ───────────────────────────────────────────────────────────

const findAll = () =>
  Assignment.find().sort({ createdDate: -1 });

const findById = (id) =>
  Assignment.findById(id);

const remove = (id) =>
  Assignment.findByIdAndDelete(id);

const findByProject = (projectId) =>
  Assignment.find({ projectId });

const findByEmployee = (employeeId) =>
  Assignment.find({ employeeId });

// ── Business logic ─────────────────────────────────────────────────────────────

// Validate, check duplicates and allocation cap, then create
const createAssignment = async (data) => {
  const { employeeId, projectId, allocation, startDate, endDate } = data;

  if (new Date(startDate) > new Date(endDate))
    return { error: 'Start date must be on or before end date.', status: 400 };

  if (allocation < 1 || allocation > 100)
    return { error: 'Allocation must be between 1 and 100.', status: 400 };

  const duplicate = await Assignment.findOne({
    employeeId, projectId, status: { $in: ['Planned', 'Active'] },
  });
  if (duplicate)
    return { error: 'Employee already has an active/planned assignment for this project.', status: 400 };

  const active = await Assignment.find({ employeeId, status: { $in: ['Planned', 'Active'] } });
  const totalAllocation = active.reduce((sum, a) => sum + a.allocation, 0);
  if (totalAllocation + Number(allocation) > 100)
    return {
      error: `Employee allocation cannot exceed 100%. Current active allocation: ${totalAllocation}%, requested: ${allocation}%.`,
      status: 400,
    };

  const newAssignment = await Assignment.create(data);
  return { data: newAssignment };
};

// Validate, check allocation cap (excluding current record), then update
const updateAssignment = async (id, data) => {
  const { allocation, startDate, endDate, employeeId } = data;

  if (startDate && endDate && new Date(startDate) > new Date(endDate))
    return { error: 'Start date must be on or before end date.', status: 400 };

  if (allocation !== undefined && (allocation < 1 || allocation > 100))
    return { error: 'Allocation must be between 1 and 100.', status: 400 };

  if (allocation !== undefined && employeeId) {
    const active = await Assignment.find({
      employeeId,
      status: { $in: ['Planned', 'Active'] },
      _id: { $ne: id },
    });
    const totalAllocation = active.reduce((sum, a) => sum + a.allocation, 0);
    if (totalAllocation + Number(allocation) > 100)
      return {
        error: `Employee allocation cannot exceed 100%. Current allocation from other projects: ${totalAllocation}%, requested: ${allocation}%.`,
        status: 400,
      };
  }

  const updated = await Assignment.findByIdAndUpdate(id, data, { new: true });
  if (!updated) return { error: 'Assignment not found.', status: 404 };

  return { data: updated };
};

module.exports = {
  findAll,
  findById,
  remove,
  findByProject,
  findByEmployee,
  createAssignment,
  updateAssignment,
};
