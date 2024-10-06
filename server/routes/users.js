const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Create or Get User
router.post('/', async (req, res) => {
  const { address } = req.body;
  let user = await User.findOne({ address });
  if (!user) {
    user = new User({ address });
    await user.save();
  }
  res.json(user);
});

module.exports = router;
