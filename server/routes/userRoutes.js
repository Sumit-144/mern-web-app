// server/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const { createUser, getAllUsers, getUserById, updateUser, deleteUser } = require('../controllers/userController');

// Configure multer for file uploads (ensure the "uploads" folder exists)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage });

// User routes
router.post('/', upload.single('profilePic'), createUser);
router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.put('/:id', upload.single('profilePic'), updateUser);
router.delete('/:id', deleteUser); 
// You can later add: router.delete('/:id', deleteUser);

module.exports = router;
