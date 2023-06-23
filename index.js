const express = require('express');
var cors = require('cors');

require('dotenv').config();
const app = express();
app.use(cors());
require("./db");
const port = process.env.PORT || 8000;
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes

app.use(express.json());
// Available routes 
app.use('/api/auth', require('./routes/auth'));
app.use('/api/notes', require('./routes/notes'));


// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
