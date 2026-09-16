const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema(
  {
    employeeName: {
      type: String,
      required: true,
    },

    emailId: {
      type: String,
      required: true,
      unique: true,
    },

    contactNo: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },

    gender: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      default: '',
    },


    deptId: {
      type: String,
      default: '',
    },

    createdDate: {
      type: Date,
    },
  }
);


module.exports = mongoose.model('Employee', EmployeeSchema);