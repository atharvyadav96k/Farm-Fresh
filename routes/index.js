var express = require('express');
var router = express.Router();
const passport = require('passport');
const localStrategy = require('passport-local');
const productModel = require("./product")
const userModel = require('./users');
passport.use(new localStrategy(userModel.authenticate()));

router.get('/post', isLoggedIn, function (req, res) {
  res.render('post');
})
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/register', function (req, res) {
  res.render('register')
})
router.post('/register', function (req, res) {
  console.log(req.body)
  const userData = new userModel({
    username: req.body.username,
    emailId: req.body.email
  });
  userModel.register(userData, req.body.password)
    .then(function () {
      passport.authenticate('local')(req, res, function () {
        res.render("search");
      })
    })
    .catch(function (err) {
      res.render('error')
      console.log(err)
    })
});
router.get('/login', function (req, res) {
  res.render('login')
});
router.get('/deleteProduct',async (req, res) => {
  const id = req.query.id;
  try{
    const deleteProduct = await productModel.findByIdAndDelete(id);
    res.redirect('/search');
  }
  catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
router.post('/login', passport.authenticate('local', {
  successRedirect: '/search',
  failureRedirect: '/login'
}));
router.post('/product', async function (req, res) {
  let savedProduct;
  try {
    console.log(req.body);
    const user = req.user.username;
    const userD = await userModel.findOne({ username: user });
    let lonLan = req.body.location.split(',');
    console.log(lonLan)
    console.log(userD._id);
    const productData = new productModel({
      userId: userD._id,
      productName: req.body.productName,
      imageUrl: req.body.url,
      productDescription: req.body.productDescription,
      productKeys: req.body.productKeys.split(',').map(part => part.trim()),
      numItems: req.body.numItems,
      address: req.body.address.split(',').map(part => part.trim().replace(/\s/g, '')),
      location: {
        type: 'Point',
        coordinates: [lonLan[0], lonLan[1]]
      },
      price : req.body.price,
      category: req.body.category
    });
    console.log(req.body.location);
    savedProduct = await productData.save();

    console.log('Product saved successfully:', savedProduct);
    // Send a JSON response
    res.redirect('profile')
  } catch (error) {
    console.error('Error saving product:', error);
    // Handle error, send an error response
    return res.status(500).json({ error: 'Internal Server Error' });
  }
  if (savedProduct) {
    console.log(savedProduct.userId, savedProduct._id)
    try {
      const updatedUser = await userModel.findByIdAndUpdate(
        savedProduct.userId,
        { $push: { products: savedProduct._id } },
        { new: true }
      );

      console.log('User updated successfully:', updatedUser);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  }
  res.render('index');
});
router.get('/all', async function (req, res) {
  const data = await productModel.find();
  res.send(data)
});
router.get('/nearbyme', async function (req, res) {
  res.render('nearbyme')
});
router.post('/nearbyme', async function (req, res) {
  const { longitude, latitude } = req.body;
  try {
    let responce = []
    const nearbyme = await productModel.find().exec();
    nearbyme.forEach((ele) => {
      let distance = calculateDistance(parseFloat(longitude), parseFloat(latitude), ele.location.coordinates[1], ele.location.coordinates[0])
      console.log(distance)
      if (distance <= 15) {
        responce.push(ele);
        console.log(distance * 10)
      }
    })
    console.log(responce)
    res.send(responce)
  } catch (err) {
    console.error(err);
    res.send(err)
  }
});
router.get('/search', function (req, res) {
  res.render('search');
});
router.post('/search', async function (req, res) {
  console.log(req.body)
  const query = req.body.filter;
  const filter = req.body.location.split(',');
  let longitude = filter[1];
  let latitude = filter[0];
  // console.log(query, filter)
  try {
    let response = []
    const nearbyme = await productModel.find({ productKeys: { $regex: new RegExp(query, 'i') } });
    // console.log(nearbyme)
    nearbyme.forEach((ele) => {
      let distance = calculateDistance(parseFloat(longitude), parseFloat(latitude), ele.location.coordinates[1], ele.location.coordinates[0])
      console.log(distance)
      if (distance <= 15) {
        console.log(ele)
        response.push(ele);
        console.log(distance * 10)
      }
    })
    res.json(response);
  }
  catch (err) {
    res.status(500).json({ error: 'Something went wrong in the server' });
  }

});
router.get('/profile', isLoggedIn, function (req, res) {
  res.render('profile')
});
router.post('/profile', isLoggedIn, async function (req, res) {
  try {
    const data = await userModel.find({ username: req.user.username }).populate('products');
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const radLat1 = (Math.PI * lat1) / 180;
  const radLon1 = (Math.PI * lon1) / 180;
  const radLat2 = (Math.PI * lat2) / 180;
  const radLon2 = (Math.PI * lon2) / 180;
  // Calculate differences in coordinates
  const dLat = radLat2 - radLat1;
  const dLon = radLon2 - radLon1;
  // Haversine formula
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(radLat1) * Math.cos(radLat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  // Distance in kilometers
  const distance = R * c;

  return distance;
}
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  }
  else {
    res.redirect('/login')
  }
}
module.exports = router;