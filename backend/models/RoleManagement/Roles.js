const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userType: {
    type: String,
  },
  roles: [{
    type: String,
  }],
});

const User = mongoose.model('UserRoles', userSchema);

module.exports = User;
