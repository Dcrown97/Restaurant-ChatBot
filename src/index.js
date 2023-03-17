const express = require('express');
const app = express();
const http = require("http")
const path = require("path")
const server = http.createServer(app);
const { Server } = require("socket.io")
const { dbConnect } = require('./client/database/db.js')
const Order = require("./client/database/model/orderModel.js")

const io = new Server(server);

app.use(express.static(path.join(__dirname, "/client")));

const PORT = process.env.PORT || 5858

//init db
dbConnect();

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/client/index.html');
});

io.on('connection', async (socket) => {
    // console.log('a user connected');
    //join a conversation 
    const { id } = socket.handshake.query;
    socket.join(id);

    // console.log("My Session ID is", id)
    socket.on("message", async (msg) => {
        if (msg == '1') {
            socket.emit("newMessage", {
                type: "order",
                message: "Please select from this list of items",
                items: [
                    {
                        name: "Chicken",
                    },
                    {
                        name: "Meat",
                    },
                    {
                        name: "Plantain",
                    },
                    {
                        name: "Coleslaw",
                    },
                    {
                        name: "Salad",
                    },
                    {
                        name: "Chips",
                    },
                ]

            });
        } else if (msg.number == '99') {
            const order = new Order({
                session_id: id,
                orders: msg.orders
            });
            order.save().then(() => {
                socket.emit("newMessage", {
                    type: "checkout",
                    message: "Order placed successfully",
                })
            });
        } else if (msg == '98') {
            const orders = await Order.find({
                session_id: id
            }).sort({
                createdAt: -1
            })
            // console.log(orders)
            if (orders.length > 0) {
                socket.emit("newMessage", {
                    type: "allOrders",
                    message: "Here are all your placed orders",
                    items: orders
                })
            } else {
                socket.emit("newMessage", {
                    type: "message",
                    message: "You don't have any order",
                })
            }
        } else if (msg == '97') {
            const orders = await Order.find({
                session_id: id
            }).sort({
                createdAt: -1
            })
            if (orders.length > 0) {
                socket.emit("newMessage", {
                    type: "allOrders",
                    message: "This is your current order",
                    items: [
                        orders[0]
                    ]
                })
            } else {
                socket.emit("newMessage", {
                    type: "message",
                    message: "You don't have any order",
                })
            }
        } else if (msg == '0') {
            const orders = await Order.find({
                session_id: id
            }).sort({
                createdAt: -1
            })
            if (orders.length > 0) {
                const currentOrder = orders[0];
                const updatedOrder = await Order.findByIdAndUpdate(currentOrder._id, {
                    status: "Cancelled"
                }, {
                    new: true
                })
                // console.log(updatedOrder)
                socket.emit("newMessage", {
                    type: "allOrders",
                    message: "Order cancelled",
                    items: [
                        updatedOrder
                    ]
                })
            } else {
                socket.emit("newMessage", {
                    type: "message",
                    message: "You don't have any order",
                })
            }
        }
        console.log('you have a message');
    })
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

server.listen(3000, () => {
    console.log("Application running on port: http://localhost:" + PORT);
});