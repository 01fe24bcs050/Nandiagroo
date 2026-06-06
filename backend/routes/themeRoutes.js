const express = require('express');
const router = express.Router();
const {
  getActiveTheme,
  getAllThemes,
  createTheme,
  updateTheme,
  deleteTheme,
  setActiveTheme,
} = require('../controllers/themeController');
const { protect, admin } = require('../middleware/auth');

router.get('/active', getActiveTheme);
router.get('/', protect, admin, getAllThemes);
router.post('/', protect, admin, createTheme);
router.put('/:id', protect, admin, updateTheme);
router.delete('/:id', protect, admin, deleteTheme);
router.put('/:id/activate', protect, admin, setActiveTheme);

module.exports = router;
