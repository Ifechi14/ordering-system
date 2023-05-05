const mongoose = require('mongoose')


const MenuSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    availability: {
        type: String,
        enum: ['ready', 'not-ready'],
        default: 'ready'
      },
    image: String
},{
    timestamps: true
});

module.exports = mongoose.model('Menu', MenuSchema)