const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  RolesTypes: {
    type: String,
  },
});

const Role = mongoose.model('RolesType', roleSchema);

module.exports = Role;
