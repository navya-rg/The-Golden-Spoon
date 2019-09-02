var express = require('express');
var bodyParser = require('body-parser');
var tgsController = require('./controllers/tgsController');
const mongoose = require('mongoose');
const app = express();

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
	res.render('index', {message: ''});
});

app.post('/subscribe', urlencodedParser, function(req, res){
	tgsController.sendMail(req.body.mailid);
	res.render('index', {message: 'You have successfully signed up :)'});
});

app.get('/about', function(req, res){
	res.render('about');
});

app.get('/cart', function(req, res){
	res.render('cart');
});

app.get('/location', function(req, res){
	res.render('location');
});

app.get('/login', function(req, res){
	res.render('login', {message: ''});
});

app.get('/forgotPassword', function(req, res){
	res.render('forgotPassword', {message: ''});
});

app.get('/menu', function(req, res){
	tgsController.fetchMenu(res);
});

app.get('/signup', function(req, res){
	res.render('signup');
});

app.get("*", function(req,res){
    res.render('404');
});

app.post('/updateMenu', urlencodedParser, function(req, res){
	var i = tgsController.updateMenu(req.body, res);
});

app.post('/signupSubmit', urlencodedParser, function(req, res){
	tgsController.signupSubmit(req.body, res);
});

app.post('/loginSubmit', urlencodedParser, function(req, res){
	tgsController.loginSubmit(req.body, res);
});

app.post('/forgotPasswordSubmit', urlencodedParser, function(req, res){
	tgsController.forgotPasswordSubmit(req.body, res);
});

app.listen(3000, function(){
	console.log('Now listening for requests');
});

module.exports.app = app;