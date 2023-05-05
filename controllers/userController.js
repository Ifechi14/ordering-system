const User = require('./../models/User');

//filter object
const  filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(el => {
        if(allowedFields.includes(el)) newObj[el] = obj[el];
    });
    return newObj;
}

//get all users
exports.getAllUsers = async (req, res) => {
    try {
        const user = await User.find();
        const { password, ...others } = user;
        res.status(200).json({
            status: 'success',
            data: others,
        });
    } catch (err) {
        res.status(404).json(err); 
    }
};


//get a user
exports.getUser = async (req, res) => {
    try {
        const user = await User.findById({ _id: req.params.id })
        if(!user){
            return res.status(404).json({ message: 'User not found'})
        }
        const { password, ...others } = user;
        res.status(200).json({
            status: 'success',
            data: user._doc,
        });
    } catch (error) {
        res.status(404).json(error); 
    }
};
 

//update a user
exports.updateUser = async (req, res, next) => {
    try {
        const user = await User.findByIdAndUpdate(
            {_id: req.params.id}, 
            req.body, 
            { new: true, runValidators: true }
        );
        if(!user){
            return res.status(404).json({ message: 'User not found'})
        }
        res.status(200).json({
            status: 'success',
            data: user,
            message: 'User details Updated!!'
        });
    } catch (err) {
        res.status(404).json(err); 
    }
};

//update authenticated user
exports.updateMe = async (req, res, next) => {
    //create error if user post password data
    if(req.body.password || req.body.passwordConfirm){
        return res.status(400).json({
            status: 'fail',
            message: 'This route is not for Password updates'
        });
    }

    //filtered out unwanted filed names that are not allowed to be updated
    const filteredBody = filterObj(req.body, 'name', 'email');

    //update user document
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        status: 'success',
        data: {
            user: updatedUser
        },
        message: 'User profile UPDATED!!'
    });
}


//delete a user
exports.deleteUser = async (req, res, next) => {
    try {
        const user = await User.findByIdAndRemove({_id: req.params.id});
        if(!user){
            return res.status(404).json({ message: 'User not found'})
        }
        res.status(204).json({
            status: 'success',
            message: 'User deleted!!'
        });
    } catch (err) {
        res.status(404).json(err); 
    }
};



exports.deleteMe = async (req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, { active: false });

    res.status(204).json({
        status: 'success',
        data: null,
        message: 'User no longer active'
    })
}
  