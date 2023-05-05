const express = require('express');
const menuController = require('./../controllers/menuController');
const authController = require('./../controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(
    authController.protect, 
    menuController.getAllMenus
  )
  .post(
    authController.protect, 
    authController.restrictTo('admin'),
    menuController.createMenu
  )

router
  .route('/:id')
  .get(
    authController.protect, 
    menuController.getMenu
  )
  .patch(
    authController.protect, 
    authController.restrictTo('admin'),
    menuController.updateMenu
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    menuController.deleteMenu
  )


module.exports = router;