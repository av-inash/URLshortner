


const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const verifyGoogleToken = async (token) => {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    return payload;
};

const authenticateUser = async (googleToken) => {
    const payload = await verifyGoogleToken(googleToken);

    let user = await User.findOne({ googleId: payload.sub });
    if (!user) {
        user = await User.create({
            googleId: payload.sub,
            email: payload.email,
            name: payload.name,
            avatar: payload.picture,
        });
    }

    const jwtToken = jwt.sign(
        { userId: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );

    return { token: jwtToken, user };
};

module.exports = { authenticateUser };

