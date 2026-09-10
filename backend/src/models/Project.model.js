const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  projectName: {
    type: String,
    required: true,
  },

  projectCode: {
    type: String,
    required: true,
    unique: true,
  },

  description: {
    type: String,
    default: '',
  },

  clientName: {
    type: String,
    required: true,
  },

  startDate: {
    type: Date,
    required: true,
  },

  endDate: {
    type: Date,
    required: true,
  },

  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    required: true,
  },

  status: {
    type: String,
    enum: ['Planning', 'Active', 'On Hold', 'Completed', 'Cancelled'],
    default: 'Planning',
  },

  createdDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Project', ProjectSchema);
