const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(
    authController.protect,
    authController.restrictTo('admin'),
    userController.getAllUsers
  );

router.patch(
  '/updateMe', 
  authController.protect, 
  userController.updateMe
)

router.delete(
  '/deleteMe', 
  authController.protect, 
  userController.deleteMe
)

router
  .route('/:id')
  .get(
    authController.protect, 
    userController.getUser
  )
  .patch(
    authController.protect, 
    userController.updateUser
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'), 
    userController.deleteUser
  );



module.exports = router;
