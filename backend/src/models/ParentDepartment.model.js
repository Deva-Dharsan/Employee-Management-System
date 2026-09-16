const mongoose = require('mongoose');

const ParentDepartmentSchema = new mongoose.Schema(
  {
    departmentName: {
      type: String,
      required: true,
    },

    departmentLogo: {
      type: String,
      default: '',
    },
  }
);

module.exports = mongoose.model('ParentDepartment', ParentDepartmentSchema);