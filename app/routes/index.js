const modelRoutes = require('./model_routes');

module.exports = function(app, db) {
	modelRoutes(app, db);
}