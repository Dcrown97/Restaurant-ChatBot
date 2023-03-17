const dotenv = require("dotenv")
dotenv.config();

exports.config = {
    mongodb: {
        url: process.env.MONGO_DB_CONNECTION_URL,
    },
};