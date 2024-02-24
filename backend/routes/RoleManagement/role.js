const express = require('express');
const router = express.Router();
const User = require('../../models/RoleManagement/Roles');
const Role = require('../../models/RoleManagement/roleType');

// POST /createRolestype
router.post('/createRolestype', async (req, res) => {
  try {
    const { userType, roles } = req.body;
  
    const newUser = new User({ userType, roles });
    const savedUser = await newUser.save();
  
    res.json(savedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.post('/createRoles', async (req, res) => {
    try {
      const { userType, roles } = req.body;
  
      // Check if user with the specified userType already exists
      const existingUser = await User.findOne({ userType });
  
      if (existingUser) {
        // If user exists, update the roles array
        existingUser.roles = roles;
        const updatedUser = await existingUser.save();
        res.json(updatedUser);
      } else {
        // If user doesn't exist, create a new user
        const newUser = new User({ userType, roles });
        const savedUser = await newUser.save();
        res.json(savedUser);
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });


  router.get('/CreateRoles', async (req, res) => {
    try {
      const { userType } = req.query;
  
      if (!userType) {
        return res.status(400).json({ error: 'User type is required in the query parameters.' });
      }
  
      // Find the user based on userType
      const user = await User.findOne({ userType });
  
      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }
  
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });


  // GET /CreateRoles/:userType
router.get('/CreateRoles/:userType', async (req, res) => {
    try {
      const { userType } = req.params;
  
      if (!userType) {
        return res.status(400).json({ error: 'User type is required in the URL parameters.' });
      }
  
      // Find the user based on userType
      const user = await User.findOne({ userType });
  
      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }
  
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
// POST /RolesType
router.post('/RolesType', async (req, res) => {
  try {
    const newUser1 = new Role({ 
      RolesTypes: req.body.RolesTypes, 
    });
    const savedRole = await newUser1.save();
  
    res.json(savedRole);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /RolesType
router.get('/RolesType', async (req, res) => {
    try {
      const allRoles = await Role.find();
      res.json(allRoles);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

module.exports = router;
