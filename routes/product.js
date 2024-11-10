const mongoose = require('mongoose');
require('dotenv').config();
const connect = async ()=>{
  await mongoose.connect(process.env.DATA_BASE);
}

connect();
const productSchema = mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  imageUrl : String,
  productName: String,
  productDescription: String,
  productKeys: [String],
  numItems: Number,
  location: {
    type: { type: String },
    coordinates: [Number],
  },
  address: [
    {
      type: String
    }
  ],
  price: Number,
  category: String,
});
module.exports = mongoose.model("Product", productSchema);