const express = require('express');
const User = require('../models/User')
const router = express.Router();
const jwt = require('jsonwebtoken');
require('dotenv').config();

const fetchUser = require('../middlewares/fetchUser');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
router.post('/createuser', [
    body('name').isLength({ min: 3 }).withMessage('Name must be at least 3 characters'),
    body('email').isEmail().withMessage('Invalid email address'),
    body('password').isLength({ min: 5 }).withMessage('password must be at least 5 characters'),
    
    
  ], async (req,res)=>
{

    const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
//Hash the password
const salt = await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //Create a user
    // const user = new User(req.body);
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    })
    try {
      let success=false;
        const result = await User.insertMany(user); 
        const data = {
            user_ID: user._id
        }
        //a function to create token using jwt and secret
        const secret = process.env.JWT_SECRET;
        const token = jwt.sign(data, secret)

        success=true
        res.send({success,token});
        
    } catch (error) {
        console.log(`error adding user, ${error}`);
        res.send(error);
        
    }
    
    
    
})


//Authenticating the user using:GET, /login
router.post('/login',[
    body('email').isEmail().withMessage('Invalid email address'),
], async (req,res)=>
{
    const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    let success=false;
    const user = await User.findOne({email: req.body.email});
    if(!user)
    {
        return res.status(400).json({message: 'Invalid login credentials'});
    }
        const isMatch = await bcrypt.compare(req.body.password, user.password);
       if(!isMatch)
       {
        res.status(400).json('Invalid login credentials');
       }
       else{

       

       const data = {
        user_ID: user._id
    }
    //a function to create token using jwt and secret
    const secret = process.env.JWT_SECRET;
    const token =  jwt.sign(data, secret)

    success=true;
     res.status(200).json({success,token});
}
  } catch (error) {
    console.error(error);
    res.status(500).json('Some internal server error occured');
    
  }
   

        
            

    })





//deleting a user from userName
router.delete('/deleteuser', async (req,res)=>
{

    //delete a user
   
    try {
        const result = await User.deleteMany({name:req.body.name}); 
        res.send(result);
        
    } catch (error) {
        console.log(`error deleting user(s), ${error}`)
        
    }
    
})

//get logged in user details
router.get('/getuser',fetchUser, async (req,res)=>
{
  //get user details
  try {
    // console.log(req.user_ID);
    const user = await User.findById(req.user_ID).select('-password');
    if(!user){
      res.status(404).json('user not found');
    }
    res.status(200).json(user);
  } catch (error) {
    // console.error(error);
    res.status(500).json(`Some error occured ${error}`);
  }
  










})





module.exports = router;