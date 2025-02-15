const { authenticateUser } = require('../services/authService');

const googleAuth = async (req, res) => {
    try {
        const { token } = req.body;
        const authData = await authenticateUser(token);

        res.status(200).json(authData);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = { googleAuth };
