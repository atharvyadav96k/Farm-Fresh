const mongoose = require('mongoose');
const plm = require('passport-local-mongoose');

const userSchema = mongoose.Schema({
  username: {
    type : String,
    required : true
  },
  emailId : {
    type : String,
    required: true
  },
  password : {
    type : String
  } ,
  contact : {
     bemail : String,
     phoneNumber : Number
  },
  products : [
    {
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Product' 
    } 
  ]

});

userSchema.plugin(plm);
module.exports = mongoose.model('User', userSchema);