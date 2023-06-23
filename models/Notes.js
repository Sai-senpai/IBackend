const mongoose = require('mongoose');

// Define the User schema
const noteSchema = new mongoose.Schema({
  user:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
    
    
  },
  tag: {
    type: String,
    default: `General`
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});
// avoiding duplicate entries 
noteSchema.index({ 'title': 1, 'description': 1, 'tag': 1, 'user': 1 }, { unique: true });
// Create the Note model
const Notes = mongoose.model('Note', noteSchema);

// Export the Note model
module.exports = Notes;