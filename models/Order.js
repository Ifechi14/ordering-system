const mongoose = require('mongoose');


const OrderSchema = new mongoose.Schema({
    customerName: {
        type: String,
        required: true,
      },
    menuID: {
        type: String,
        required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    status: {
      type: String,
      enum: ['pending', 'delivered'],
      default: 'pending'
    },
},{
    timestamps: true
});

module.exports = mongoose.model('Order', OrderSchema)