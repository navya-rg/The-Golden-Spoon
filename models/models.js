const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ItemSchema = new Schema({
	meal: String,
	item: String,
	description: String,
	price: Number,
	name: String
});

const Item = mongoose.model('items', ItemSchema);
module.exports.Item = Item;

const UserSchema = new Schema({
	firstName: String,
	lastName: String,
	email: String,
	password: String,
	phnumber: String,
	newsletter: Boolean
});

const User = mongoose.model('user', UserSchema);
module.exports.User = User;

const SubscriberSchema = new Schema({
	email: String
});

const Subscriber = mongoose.model('subscribers', SubscriberSchema);
module.exports.Subscriber = Subscriber;