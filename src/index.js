const express = require('express');
const app = express();
const http = require('http');
const path = require('path');
const { emit } = require('process');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use(express.static(path.join(__dirname, "client")));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/client/index.html');
});

io.on('connection', (socket) => {
    console.log('a user connected');

    const orders = []

    socket.on("message", (msg) => {
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

            orders.push({
                date: new Date(),
                orders: msg.orders,
                status: "Pending"
            })


            socket.emit("newMessage", {
                type: "checkout",
                message: "Order placed successfully",
            })

            console.log(orders)
        } else if (msg == '98') {
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
            if (orders.length > 0) {
                socket.emit("newMessage", {
                    type: "allOrders",
                    message: "This is your current order",
                    items: [
                        orders[orders.length - 1]
                    ]
                })
            } else {
                socket.emit("newMessage", {
                    type: "message",
                    message: "You don't have any order",
                })
            }
        } else if (msg == '0') {
            if (orders.length > 0) {

                const currentOrder = orders[orders.length - 1];
                currentOrder.status = "Cancelled";


                socket.emit("newMessage", {
                    type: "allOrders",
                    message: "Order cancelled",
                    items: [
                        currentOrder
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
    console.log('listening on *:3000');
});