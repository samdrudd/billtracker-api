var mongoose = require('mongoose');

module.exports.transactionSchema = mongoose.Schema({
	Name: String,			// What is this transaction called?
	Amount: Number,			// How much is the transaction? Negative for bills, positive for income (e.g paychecks)
	Repeats: String,		// "Monthly" or "Weekly"? Or, "None" for non-repeating transactions
	RepeatsOn: Number,		// What # of "Repeats" does this repeat on? e.g. if "Repeats" is "Monthly" and "RepeatsOn" is 1, this transaction repeats the first of every month - if "Repeats" is "Weekly" and "RepeatsOn" is 2, this repeats every 2 weeks
	Date: Date				// What is the date of this transaction? If this is a repeating transaction, this is the date of the first transaction. If this is a non-repeating transaction, this is the date of the transaction.
});