const Order = require('./../models/Order');
// const AppError = require('../utils/appError');
// const catchAsync = require('./../utils/catchAsync');
const Menu = require('./../models/Menu');

// Create a new order
exports.createOrder = async (req, res, next) => {
    try {
      const { customerName, menuID, quantity, status } = req.body;
  
      // Find the menu based on the menuID
      const menu = await Menu.findById(menuID);
  
      // If the menu does not exist, return an error response
      if (!menu) {
        return res.status(400).json({ error: 'Invalid menu ID' });
      }
  
      // Create a new order with the username, menu, and quantity
      const order = await Order.create({ customerName, menuID, quantity, status });
        res.status(201).json({
            status: 'Success',
            data: order,
        });

    } catch (error) {
      // Return an error response if there is an exception
      res.status(500).json({ error: error.message });
    }
};


//get all orders
exports.getAllOrders = async (req, res, next) => {
    try {
        const order = await Order.find();
        res.status(200).json({
            status: 'success',
            data: order,
        });
    } catch (err) {
        res.status(404).json(err);
    }
};

//get a order
exports.getOrder = async (req, res, next) => {
    try {
        const order = await Order.findById({ _id: req.params.id })
        if(!order){
            return res.status(404).json({ error: 'Order not found' });
        }
        res.status(200).json({
            status: 'success',
            data: order,
        });
    } catch (err) {
        res.status(404).json(err);
    }
};
 

//update a order
exports.updateOrder = async (req, res, next) => {
    try {
        const order = await Order.findByIdAndUpdate(
            {_id: req.params.id}, 
            req.body, 
            { new: true, runValidators: true }
        );
        if(!order){
            return res.status(404).json({
                status: 'fail',
                error: 'Order not found'
            })
        }
        res.status(200).json({
            status: 'success',
            data: order,
            message: 'Order details Updated!!'
        });
    } catch (err) {
        res.status(404).json(err);
    }
};


//delete a order
exports.deleteOrder = async (req, res, next) => {
    try {
        const order = await Order.findByIdAndRemove({_id: req.params.id});
         if(!order){
            return res.status(404).json({
                status: 'fail',
                error: 'Order not found'
            })
        }
        res.status(200).json({
            status: 'success',
            message: 'Order deleted!!'
        });
    } catch (err) {
        res.status(404).json(err);
    }
};

  