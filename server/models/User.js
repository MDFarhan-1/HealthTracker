const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  address: { type: String, required: true, unique: true },
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
  rewards: { type: Number, default: 0 },
});

module.exports = mongoose.model('User', userSchema);
