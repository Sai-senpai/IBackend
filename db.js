const mongoose = require('mongoose');


const connectionString = process.env.CONNECTION_STRING;
//connect to mongoose database with promise chain 
mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then(() => {
      console.log('Connected to MongoDB Atlas');
      // Start your application logic here
    })
    .catch((error) => {
      console.error('Error connecting to MongoDB Atlas:', error);
    });
