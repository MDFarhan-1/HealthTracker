const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  name: { type: String, required: true },
  completed: { type: Boolean, default: false },
  completionCount: { type: Number, default: 0 },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

module.exports = mongoose.model('Task', taskSchema);
