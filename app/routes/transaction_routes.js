const TransactionModel = require('../models/Transaction');
const jwt = require('jsonwebtoken');
const { authenticateToken } = require('../middleware/middleware');

module.exports = function(app, db) {
	const Transaction = db.model('Transaction', TransactionModel.transactionSchema, 'transactions');

    // Create a Transaction
	app.post('/transactions', authenticateToken, (req, res) => {
		var transaction = new Transaction(req.body); 
        transaction.userId = req.user.id;
        
		transaction.save().then((savedDoc) => {
			res.status(201).json(savedDoc);
		})
        .catch(error => {
            console.log("Error saving Transaction: " + error);
            res.status(500).json({message: 'Error saving Transaction', error: error.message});
        });
	});


    // Find a Transaction by ID
	app.get('/Transaction/:id', authenticateToken, (req, res) => {
		Transaction.findById(req.params.id).then((foundDoc) => {
            if (foundDoc)
			    res.status(200).send(foundDoc);
            else
                res.status(404).json({message: "Transaction not found"});
		})
        .catch(error => {
            console.log("Error searching for Transaction: " + error);
            res.status(500).json({message: "Error searching for Transaction", error: error.message});
        });
	});

    // Find all Transactions
	app.get('/transactions', authenticateToken, (req, res) => {
		Transaction.find({userId: req.user.id}).then((results) => {
			res.send(results);
		})
        .catch(error => {
            console.log("Error retrieving all Transactions: " + error);
            res.status(500).json({message: "Error retrieving all Transactions", error: error.message});
        });
	
	});

    // Update a Transaction
	app.put('/transactions/:id', authenticateToken, (req, res) => {
        Transaction.findByIdAndUpdate(req.params.id, req.body, {new: true}).then((savedDoc) => {
            if (savedDoc)
			    res.send(savedDoc);
            else
                res.status(404).json({message: "Transaction not found"});
		})
        .catch(error => {
            console.log("Error updating Transaction: " + error);
            res.status(500).json({message: "Error updating Transaction", error: error.message});
        });
	});

    // Delete a Transaction
	app.delete('/transactions/:id', authenticateToken, (req, res) => {
		Transaction.findByIdAndDelete(req.params.id).then((deletedDoc) => {
            if (deletedDoc)
			    res.send(deletedDoc);
            else
                res.status(404).json({message: "Transaction not found"});
		})
        .catch(error => {
            console.log("Error deleting Transaction: " + error);
            res.status(500).json({message: "Error deleting Transaction", error: error.message});
        });
	});
};