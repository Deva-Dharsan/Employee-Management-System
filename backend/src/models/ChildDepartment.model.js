const mongoose = require('mongoose');

const ChildDepartmentSchema = new mongoose.Schema(
  {
    departmentName: {
      type: String,
      required: true,
    },

    ParentDeptId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ParentDepartment',
      required: true,
    },
  }
);

module.exports = mongoose.model('ChildDepartment', ChildDepartmentSchema);