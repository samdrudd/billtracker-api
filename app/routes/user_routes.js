const UserModel = require('../models/User');
const jwt = require('jsonwebtoken');
const { authenticateToken } = require('../middleware/middleware');
const errorCodes = {
    USER_ALREADY_EXISTS: 1,
    PASSWORD_TOO_SHORT: 2,
    INVALID_EMAIL: 3,
    INVALID_CREDENTIALS: 4,
    UNKNOWN_ERROR: 99
}

module.exports = function(app, db) {
	const User = db.model('User', UserModel.userSchema, 'users');
    const JWT_SECRET = process.env.JWT_SECRET;

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
                return res.status(409).json({ errors: [errorCodes.USER_ALREADY_EXISTS]});
            }
    
            // Create new user
            const newUser = new User({ username, email, password });
            const savedUser = await newUser.save();
    
            res.status(201).send();
        } catch (error) {
            console.error("Error creating user: ", error);

            let errors = [];

            if (error.errors.password)
                errors.push(errorCodes.PASSWORD_TOO_SHORT);

            if (error.errors.email)
                errors.push(errorCodes.INVALID_EMAIL);

            if (errors.length > 0)
                return res.status(400).json({ errors: errors });

            errors.push(errorCodes.UNKNOWN_ERROR);
            res.status(500).json({ errors: errors});
        }
	});

    // Login a user
    app.post('/users/login', async (req, res) => {
        try {
            const {username, password } = req.body; 

            const user = await User.findOne({ $or: [{ username: username }, { email: username }] });
            if (!user) {
                return res.status(401).json({ errors: [errorCodes.INVALID_CREDENTIALS]});
            }

            const isMatch = await user.comparePassword(password);
            if (!isMatch) {
                return res.status(401).json({ errors: [errorCodes.INVALID_CREDENTIALS]});
            }
            
            const token = generateToken(user._id);
            res.status(200).json({ user: { id: user._id, username: user.username, email: user.email, token: token } });
        } catch (error) {
            console.error("Error logging in user: ", error);
            res.status(500).json({ errors: [errorCodes.UNKNOWN_ERROR]});
        }
	});

    // Verify user token
    app.post('/users/tokenAuth', authenticateToken, async (req, res) => {
        // If we got back here from authenticateToken, the token is valid
        const user = await User.findById(req.user.id);
        user.token = req.user.token;

        res.status(200).json({ user: { id: user._id, username: user.username, email: user.email, token: user.token } });
	});
};