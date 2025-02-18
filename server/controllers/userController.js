// server/controllers/userController.js
const mongoose = require('mongoose');
const User = require('../models/User');
const fs = require('fs');
const path = require('path');


const createUser = async (req, res) => {
  try {
    // Extract fields from req.body
    const { name, email, company, salary } = req.body;
    
    // Get file path from multer if provided
    let profilePicUrl = '';
    if (req.file) {
      profilePicUrl = req.file.path;
    }

    // Convert company string to ObjectId (will throw if invalid)
    const companyId = new mongoose.Types.ObjectId(company);

    const user = await User.create({
      name,
      email,
      profilePic: profilePicUrl,
      professionalInfo: {
        salary,
        company: companyId,
      },
    });

    res.status(201).json(user);
  } catch (error) {
    console.error('Error in createUser:', error);
    res.status(500).json({ message: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    // Populate the company details in professionalInfo
    const users = await User.find().populate('professionalInfo.company');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('professionalInfo.company');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { name, email, company, salary } = req.body;

    // Find the existing user first
    const existingUser = await User.findById(req.params.id);
    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    let profilePicUrl = '';
    if (req.file) {
      profilePicUrl = req.file.path;

      // If there is an existing profile picture, delete it from disk
      if (existingUser.profilePic) {
        // Construct the absolute path; process.cwd() returns the current working directory (server root)
        const oldFilePath = path.join(process.cwd(), existingUser.profilePic);
        fs.unlink(oldFilePath, (err) => {
          if (err) {
            console.error('Error deleting old profile picture:', err);
          } else {
            console.log('Old profile picture deleted successfully');
          }
        });
      }
    }

    // Prepare the data to update
    const updateData = {
      name,
      email,
      professionalInfo: {
        salary,
        company, // assuming company is a valid ObjectId string from the client
      },
    };

    if (profilePicUrl) {
      updateData.profilePic = profilePicUrl;
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(updatedUser);
  } catch (err) {
    console.error('Error in updateUser:', err);
    res.status(500).json({ message: err.message });
  }
};


// server/controllers/userController.js
const deleteUser = async (req, res) => {
  try {
    // Find the user to be deleted
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // If the user has a profile picture, delete it from disk
    if (user.profilePic) {
      const filePath = path.join(process.cwd(), user.profilePic);
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error('Error deleting profile picture:', err);
        } else {
          console.log('Profile picture deleted successfully');
        }
      });
    }

    // Now delete the user from the database
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Error in deleteUser:', err);
    res.status(500).json({ message: err.message });
  }
};


module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  // (deleteUser could be added here)
};
