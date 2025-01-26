const Order = require("../models/order")
const User = require("../models/user")
const axios = require('axios')
const mongoose = require("mongoose")

module.exports.index = async (req, res) => {
    const orders = await Order.find({})
    res.render('order/index', { orders })
}
// accessed by fruitify admin
module.exports.new = async (req, res) => {
    const { _doc, orderKey } = req.body
    const { product, price, status, address, phone, _id } = _doc
    if (process.env.ORDER_KEY !== orderKey) {
        return res.status(401).send("Unauthorized")
    }
    console.log(req.body)
    const order = new Order({ product, price, status, address, phone, orderId: _id })
    await order.save()
    res.status(200).send("Success")
}
module.exports.update = async (req, res) => {
    const { id } = req.params
    const order = await Order.findById(new mongoose.Types.ObjectId(id))
    let user = await User.findOne({ username: req.user.username });
    const sender = "admin@frutify"
    const reciever = user.cashifyUsername
    const amount = order.price
    const transactionData = {
        sender,
        reciever,
        amount,
        adminAuth: process.env.ADMIN_AUTH
    };
    await axios.post('http://localhost:3001/transactions', transactionData);
    order.status = "Delivered"
    await order.save()
    await axios.put('http://localhost:3002/order', { orderKey: process.env.ORDER_KEY, status: order.status, id: order.orderId })
    user.order.push(order)
    await user.save()
    res.redirect('/order/history')
}
module.exports.history = async (req, res) => {
    const { order } = await User.findOne({ username: req.user.username }).populate('order')
    res.render('order/history', { orders: order })
}