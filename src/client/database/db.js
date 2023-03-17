

const { config } = require("../config/config");
const mongoose = require("mongoose")

exports.dbConnect = () => {
    mongoose.connect(config.mongodb.url).then(() => console.log("Connected!"));
}
