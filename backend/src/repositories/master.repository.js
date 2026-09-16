const ParentDepartment = require('../models/ParentDepartment.model');
const ChildDepartment  = require('../models/ChildDepartment.model');

const findAllParent = () =>
  ParentDepartment.find();

const findChildrenByParent = (parentId) =>
  ChildDepartment.find({ ParentDeptId: parentId });

const createParent = (data) =>
  ParentDepartment.create(data);

const createChild = (data) =>
  ChildDepartment.create(data);

module.exports = {
  findAllParent,
  findChildrenByParent,
  createParent,
  createChild,
};
