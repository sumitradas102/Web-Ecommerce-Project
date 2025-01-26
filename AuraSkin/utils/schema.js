const Joi = require('joi')

module.exports.orderSchema = Joi.object({
    product: Joi.array().items(Joi.string()).required(),
    price: Joi.number().min(0).required(),
    status: Joi.string().required(),
    address: Joi.string().required(),
    phone: Joi.string().required(),
    orderId: Joi.string().required()
});

module.exports.userSchema = Joi.object({
    cashifyUsername: Joi.string().required(),
    username: Joi.string().required(),
    password: Joi.string().required(),
    id: Joi.string().required(),
    order: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)) // Assuming ObjectId is 24 hex characters
});
