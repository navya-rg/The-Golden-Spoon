const express = require('express');
const bodyParser = require('body-parser');
const tgsController = require('./controllers/tgsController');
const mongoose = require('mongoose');
const models = require('./models/models');
const app = express();

const cookieParser = require('cookie-parser');
const session = require('express-session');

app.use(cookieParser());
app.use(session({
  secret: "SecretKey",
  resave: false,
    saveUninitialized: true
    }));

var urlencodedParser = bodyParser.urlencoded({extended: false});
mongoose.connect('mongodb://localhost/tgs');
mongoose.Promise = global.Promise;

//set up template engine
app.set('view engine', 'ejs');
//static files
app.use('/assets', express.static('./public/assets'));
app.use('/images', express.static('./public/images'));
app.use('/videos', express.static('./public/videos'));
app.use(bodyParser.json());

app.get('/index', function(req, res){
	res.render('index', {message: '', user: req.session.user});
});

app.post('/subscribe', urlencodedParser, function(req, res){
	tgsController.sendMail(req.body.mailid);
	res.render('index', {message: 'You have successfully signed up :)'});
});

app.get('/about', function(req, res){
	res.render('about', {user: req.session.user});
});

/*app.get('/profile', function(req, res){
	res.render('profile', {user: req.session.user});
});*/

app.get('/cart', function(req, res){
	tgsController.printCart(req, res);
});

app.get('/payment', function(req, res){
	res.render('payment', {user: req.session.user});
});

app.get('/ordersuccess', function(req, res){
	res.render('ordersuccess', {user: req.session.user});
});

app.get('/creditcard', function(req, res){
	res.render('creditcard', {user: req.session.user});
});

app.get('/debitcard', function(req, res){
	res.render('debitcard', {user: req.session.user});
});

app.get('/netbanking', function(req, res){
	res.render('netbanking', {user: req.session.user});
});

app.get('/location', function(req, res){
	res.render('location', {user: req.session.user});
});

/*app.get('/reservation', function(req, res){
	res.render('reservation');
});*/

app.get('/login', function(req, res){
	res.render('login', {message: ''});
});

app.get('/logout', function(req, res){
	tgsController.logout(req, res);
});

app.get('/forgotPassword', function(req, res){
	res.render('forgotPassword', {message: ''});
});

app.get('/menu', function(req, res){
	tgsController.fetchMenu(req, res);
});

app.get('/signup', function(req, res){
	res.render('signup');
});

app.get("*", function(req,res){
    res.render('404', {user: req.session.user});
});

app.post('/deleteFromCart', urlencodedParser, function(req, res){
	tgsController.deleteFromCart(req, res);
});

app.post('/updateMenu', urlencodedParser, function(req, res){
	var i = tgsController.updateMenu(req.body, res);
});

app.post('/signupSubmit', urlencodedParser, function(req, res){
	tgsController.signupSubmit(req, res);
});

app.post('/loginSubmit', urlencodedParser, function(req, res){
	tgsController.loginSubmit(req, res);
});

app.post('/forgotPasswordSubmit', urlencodedParser, function(req, res){
	tgsController.forgotPasswordSubmit(req.body, res);
});

app.post('/add2cart', urlencodedParser, function(req, res){
	tgsController.add2cart(req, res);
});

app.listen(3000, function(){
	console.log('**Now listening for requests**');
});

module.exports.app = app;