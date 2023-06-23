//fetch user from decoding token
const jwt = require('jsonwebtoken');
require('dotenv').config();

const fetchUser = async (req,res,next)=>{
    //get the user using jwt token and append the user_ID to req


    try {
        // we send auth token in the headers 
        const token = req.header('auth-token');
    if(!token){
        res.status(401).json('use valid token');
        next();
    }
    const secret = process.env.JWT_SECRET;
    const result =  jwt.verify(token,secret);
    // console.log(result);
    // this contains object where user_ID is what we are looking for   


    // Adding new field to req 
    req.user_ID = result.user_ID;
    } catch (error) {
        res.status(401).json('use valid token')
    }
    




    next();

}







module.exports = fetchUser;