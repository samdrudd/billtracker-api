var mongoose = require('mongoose');

module.exports.transactionSchema = mongoose.Schema({
	Name: String,
	Amount: Number,
	DayOfMonth: Number
});