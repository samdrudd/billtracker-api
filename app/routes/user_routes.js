const UserModel = require('../models/User');
const jwt = require('jsonwebtoken');

module.exports = function(app, db) {
	const User = db.model('User', UserModel.userSchema, 'users');
    const JWT_SECRET = process.env.JWT_SECRET;

    const generateToken = (userId) => {
        return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '24h' });
    }

    // Create a User
	app.post('/users/create', async (req, res) => {
        try {
            const {username, email, password } = req.body; 

            // Check if username or email already exists
            const existingUser = await User.findOne({ $or: [{ username }, { email }] });
            if (existingUser) {
                return res.status(409).json({ message: 'Username or email already exists' });
            }
    
            // Create new user
            const newUser = new User({ username, email, password });
            const savedUser = await newUser.save();
    
            res.status(201).json({ user: savedUser });
        } catch (error) {
            console.error("Error creating user: ", error);
            res.status(500).json({ message: 'Internal server error'});
        }
	});

    app.post('/users/login', async (req, res) => {
        try {
            const {username, password } = req.body; 

            const user = await User.findOne({ $or: [{ username: username }, { email: username }] });
            if (!user) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            const isMatch = await user.comparePassword(password);
            if (!isMatch) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }
            
            const token = generateToken(user._id);
            res.status(200).json({ user, token });
        } catch (error) {
            console.error("Error logging in user: ", error);
            res.status(500).json({ message: 'Internal server error'});
        }
	});
};