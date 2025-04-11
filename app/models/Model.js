var mongoose = require('mongoose');

module.exports.modelSchema = mongoose.Schema({
	StringField: String,
	NumberField: Number,
	DateField: Date,
	BooleanField: Boolean,
	ArrayField: Array
});