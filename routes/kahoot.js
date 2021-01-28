const express = require('express');
const { check } = require('express-validator');
const { createKahoot, getKahoots, getKahootsByUserId, getKahootById, deleteKahootById } = require('../handlers/kahoot');
const router = express.Router();
const { authMiddleware } = require('../middlewares/authMiddleware');

/*
  @route POST /api/v1/kahoot
  @desc create a kahoot
  @access Private
*/
router.post('/', [authMiddleware,
  [
    check('title', 'Title must not be empty').not().isEmpty(),
    check('description', 'Description must not be empty').not().isEmpty(),
    check('image', 'Image must be provide').not().isEmpty(),
    check('listQuestion', 'List question must be valid').notEmpty(),
  ]
], createKahoot);

/*
  @route GET /api/v1/kahoot
  @desc get all kahoots
  @access Public
*/
router.get('/', getKahoots);

/*
  @route GET /api/v1/kahoot/user/:userId
  @desc get kahoot by user id
  @access Public
*/
router.get('/user/:userId', getKahootsByUserId);

/*
  @route GET /api/v1/kahoot/:id
  @desc get kahoot by id
  @access Public
*/
router.get('/:id', getKahootById);

/*
  @route Delete /api/v1/kahoot/:id
  @desc delete kahoot by id
  @access private
*/

router.delete('/:id',authMiddleware, deleteKahootById)

module.exports = router;