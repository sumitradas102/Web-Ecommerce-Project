const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const { isLoggedIn, } = require('../utils/middleware')
const order = require('../controllers/order')
router.route('/')
    .get(isLoggedIn, wrapAsync(order.index))
    .post(wrapAsync(order.new))
router.route('/history')
    .get(isLoggedIn, wrapAsync(order.history))
router.route('/:id')
    .put(isLoggedIn, wrapAsync(order.update))
module.exports = router;