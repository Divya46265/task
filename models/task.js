const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  assignedTo: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed'],
    default: 'pending'
  },
  timeSpent: {
    type: Number,
    default: 0
  },
  dueDate: {
    type: String,
    required: true
  }
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
