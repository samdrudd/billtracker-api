const ModelModel = require('../models/Model');

module.exports = function(app, db) {
	const Model = db.model('Model', ModelModel.modelSchema, 'models');

    // Create a Model
	app.post('/models', (req, res) => {
		var model = new Model(req.body); 
		model.save().then((savedDoc) => {
			res.status(201).json(savedDoc);
		})
        .catch(error => {
            console.log("Error saving Model: " + error);
            res.status(500).json({message: 'Error saving Model', error: error.message});
        });
	});


    // Find a Model by ID
	app.get('/models/:id', (req, res) => {
		Model.findById(req.params.id).then((foundDoc) => {
            if (foundDoc)
			    res.status(200).send(foundDoc);
            else
                res.status(404).json({message: "Model not found"});
		})
        .catch(error => {
            console.log("Error searching for Model: " + error);
            res.status(500).json({message: "Error searching for Model", error: error.message});
        });
	});

    // Find all Models
	app.get('/models', (req, res) => {
		Model.find({}).then((results) => {
			res.send(results);
		})
        .catch(error => {
            console.log("Error retrieving all Models: " + error);
            res.status(500).json({message: "Error retrieving all Models", error: error.message});
        });
	
	});

    // Update a Model
	app.put('/models/:id', (req, res) => {
        Model.findByIdAndUpdate(req.params.id, req.body, {new: true}).then((savedDoc) => {
            if (savedDoc)
			    res.send(savedDoc);
            else
                res.status(404).json({message: "Model not found"});
		})
        .catch(error => {
            console.log("Error updating Model: " + error);
            res.status(500).json({message: "Error updating Model", error: error.message});
        });
	});

    // Delete a Model
	app.delete('/models/:id', (req, res) => {
		Model.findByIdAndDelete(req.params.id).then((deletedDoc) => {
            if (deletedDoc)
			    res.send(deletedDoc);
            else
                res.status(404).json({message: "Model not found"});
		})
        .catch(error => {
            console.log("Error deleting Model: " + error);
            res.status(500).json({message: "Error deleting Model", error: error.message});
        });
	});
};