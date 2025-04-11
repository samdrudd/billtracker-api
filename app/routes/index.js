const transactionRoutes = require('./transaction_routes');

module.exports = function(app, db) {
	transactionRoutes(app, db);
}