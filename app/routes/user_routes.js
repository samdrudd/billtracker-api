const UserModel = require('../models/User');
const jwt = require('jsonwebtoken');

module.exports = function(app, db) {
	const User = db.model('User', UserModel.userSchema, 'users');
    const JWT_SECRET = process.env.JWT_SECRET;

    const authenticateToken = (req, res, next) => {
        const token = req.body.token;
        if (!token) return res.sendStatus(401); // Unauthorized

        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) return res.sendStatus(403); // Forbidden
            req.user = user;
            console.log(req.user);
            next();
        });
    }

    const generateToken = (userId) => {
        return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '24h' });
    }

    // Create a user
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
    
            res.status(201).send();
        } catch (error) {
            console.error("Error creating user: ", error);
            res.status(500).json({ message: 'Internal server error'});
        }
	});

    // Login a user
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
            res.status(200).json({ user: { id: user._id, username: user.username, email: user.email, token: token } });
        } catch (error) {
            console.error("Error logging in user: ", error);
            res.status(500).json({ message: 'Internal server error'});
        }
	});

    // Verify user token
    app.post('/users/tokenAuth', authenticateToken, async (req, res) => {
        // If we got back here from authenticateToken, the token is valid
        const user = await User.findById(req.user.id);
        const token = req.body.token;

        res.status(200).json({ user: { id: user._id, username: user.username, email: user.email, token: token } });
	});
};