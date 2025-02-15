const dotenv = require('dotenv');

dotenv.config();

if (!process.env.MONGO_URI || !process.env.REDIS_URI || !process.env.JWT_SECRET) {
    console.error('Missing required environment variables.');
    process.exit(1);
}
