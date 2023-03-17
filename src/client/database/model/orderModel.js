const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema(
    {
        session_id: { type: String, required: true },
        orders: {
            type: mongoose.Schema.Types.Array,
            required: true
        },
        status: { type: String, default: 'Pending', enum: ['Pending', 'Cancelled'] }
    },
    { timestamps: true }
)

module.exports = mongoose.model('Order', orderSchema)