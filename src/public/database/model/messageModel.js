const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema(
    {
        session_id: { type: String, required: true, unique: true },
        message: { type: String, required: true, unique: true },
    },
    { timestamps: true }
)

module.exports = mongoose.model('Message', messageSchema)