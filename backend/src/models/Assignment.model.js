const mongoose = require('mongoose');

const AssignmentSchema = new mongoose.Schema({
  employeeId: {
    type: String,
    required: true,
  },

  projectId: {
    type: String,
    required: true,
  },

  role: {
    type: String,
    required: true,
  },

  allocation: {
    type: Number,
    required: true,
    min: 1,
    max: 100,
  },

  startDate: {
    type: Date,
    required: true,
  },

  endDate: {
    type: Date,
    required: true,
  },

  status: {
    type: String,
    enum: ['Planned', 'Active', 'Completed', 'Cancelled'],
    default: 'Planned',
  },

  createdDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Assignment', AssignmentSchema);
