const Menu = require('./../models/Menu');
// const catchAsync = require('./../utils/catchAsync');

//create menu 
exports.createMenu = async (req, res) => {
    const { name, description, price, availability } =req.body;
    try {
        const menu = await Menu.create({ name, description, price, availability });
        res.status(200).json({
            status: 'Success',
            data: menu,
        });
    } catch (err) {
        res.status(404).json(err); 
    }
};


//get all menus
exports.getAllMenus = async (req, res) => {
    try {
        const menu = await Menu.find({ availability: 'ready' });
        res.status(200).json({
            status: 'success',
            data: menu,
        });
    } catch (error) {
        res.status(404).json(err); 
    }
};


//get a menu
exports.getMenu = async (req, res) => {
    try {
        const menu = await Menu.findById({ _id: req.params.id })
        if(!menu){
            return res.status(404).json({ message: 'Menu not found'})
        }
        res.status(200).json({
            status: 'success',
            data: menu,
        });
    } catch (err) {
        res.status(404).json({
            statis: 'fail'
        }); 
    }
};
 

//update a menu
exports.updateMenu = async (req, res) => {
    try {
        const menu = await Menu.findByIdAndUpdate(
            {_id: req.params.id}, 
            req.body, 
            { new: true, runValidators: true }
        );
        if(!menu){
            return res.status(404).json({ message: 'Menu not found'})
        }
        res.status(200).json({
            status: 'success',
            data: menu,
            message: 'Menu details Updated!!'
        });
    } catch (err) {
        res.status(404).json(err); 
    }
};


//delete a menu
exports.deleteMenu = async (req, res) => {
    try {
        const menu = await Menu.findByIdAndRemove({_id: req.params.id});
        if(!menu){
           return res.status(404).json({ message: 'Menu not found'})
       }
       res.status(200).json({
           status: 'success',
           message: 'Menu deleted!!'
       });
    } catch (err) {
        res.status(404).json(err);
    }
};

  