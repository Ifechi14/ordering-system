// const { promisify }= require('util');
const jwt = require('jsonwebtoken');
const User = require('./../models/User');

const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
}

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);
    const cookieOptions = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
        httpOnly: true
     }
     if(process.env.NODE_ENV === 'production') cookieOptions.secure = true;

     res.cookie('jwt', token, cookieOptions);

     //
     user.password= undefined;

    res.status(200).json({
        status: 'success',
        token,
        data: {
            user
        }
    })
}

//user signup
exports.signup = async (req, res, next) => {
    try {
        const newUser = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            passwordConfirm: req.body.passwordConfirm,
            role: req.body.role
        });

        createSendToken(newUser, 201, res);
    } catch (err) {
        res.status(500).json({ status: false, message: err.message })
    }

}

//user signin
exports.signin = async (req, res, next) =>{
    try {
        const { email, password } = req.body;
        //check if email and password exists
        if(!email || !password) {
        return res.status(400).json({
            status: 'fail',
            message: 'Please provide email and password'
        });
        }

        //check if user exists & if password is correct
        const user = await User.findOne({ email }).select('+password');

        if(!user || !await user.correctPassword(password, user.password)) {
            return res.status(401).json({
                status: 'fail',
                message: 'Incorrect email or Password'
            });
        }

        //send token to client
        createSendToken(user, 201, res);

        } catch (err) {
        res.status(500).json({ status: 'fail', message: 'Wrong credentials'})
    }
        
}

//user signout
exports.signout = (req, res) =>{
    
}

//protected route
exports.protect = async (req, res, next) => {
    //getting the token and check if ir exists
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1]
    }

    if(!token){
        return res.status(401).json({
            status: 'fail',
            message: 'You are not logged in! Please log in to get access.'
        })
    }
    
    //verification of token
    const decoded = (jwt.verify)(token, process.env.JWT_SECRET);

    //check if user still exists 
    const id = decoded.id;
    const currentUser = await User.findById(id);
    if(!currentUser){
        return res.status(401).json({ 
            status: 'fail',
            message: 'User no longer exists'
        });
    }
    //check if user changed password after issue of token 
    if(currentUser.changePasswordAfter(decoded.iat)) {
        return res.status(401).json({
            status: 'fail',
            message: 'User recently changed password!! Login again'
        })
    }

    //grant access to the protected route
    req.user = currentUser;
    next();
}


exports.restrictTo = (...roles) => {
    return (req, res, next) => {
      // roles ['admin']. role='user'
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({
            status: 'forbidden',
            message: 'You do not have permission to perform this action'
        })
      }
      next();
    };
};