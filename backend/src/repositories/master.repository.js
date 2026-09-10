const ParentDepartment = require('../models/ParentDepartment.model');
const ChildDepartment  = require('../models/ChildDepartment.model');

// ── Mongoose queries + data shaping ───────────────────────────────────────────

// Returns shaped parent department list ready to send to client
const getAllParentDepts = async () => {
  const departments = await ParentDepartment.find();
  return departments.map((dept) => ({
    departmentId:   dept._id,
    departmentName: dept.departmentName,
    departmentLogo: dept.departmentLogo,
  }));
};

// Returns shaped child department list for a given parent
const getChildDeptsByParent = async (parentId) => {
  const children = await ChildDepartment.find({ ParentDeptId: parentId });
  return children.map((child) => ({
    childDeptId:    child._id,
    ParentDeptId:   child.ParentDeptId,
    departmentName: child.departmentName,
  }));
};

const createParent = (data) =>
  ParentDepartment.create(data);

const createChild = (data) =>
  ChildDepartment.create(data);

module.exports = {
  getAllParentDepts,
  getChildDeptsByParent,
  createParent,
  createChild,
};
