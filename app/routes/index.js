const transactionRoutes = require('./transaction_routes');
const userRoutes = require('./user_routes');

module.exports = function(app, db) {
	transactionRoutes(app, db);
	userRoutes(app, db);
}