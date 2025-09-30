const Order = require('../models/order');
const { NotFoundError, ForbiddenError } = require('../lib/errors');
const { userRoles, statusCode } = require('../lib/constants');

exports.create = async (req, res) => {
    const { client, checklist, inspection_manager, meta } = req.body;
    const order = new Order({
      procurement_manager: req.user._id,
      client,
      checklist,
      inspection_manager, 
      meta
    });
    await order.save();
    res.status(statusCode.CREATED).json(order);
};

exports.getById = async (req, res) => {
    const query = {
        _id: req.params.orderId,
    };
    if (req.user.role !== userRoles.ADMIN) {
        query["$or"] = [
            {procurement_manager: req.user._id},
            {inspection_manager: req.user._id},
            {client: req.user._id}
        ]
    }
    const order = await Order.findOne(query).populate('procurement_manager inspection_manager client checklist', '-password');
    if (!order) throw new NotFoundError('Order not found');
    res.status(statusCode.OK).json(order);
};

exports.updateStatus = async (req, res) => {
    const { status } = req.body;
    const order = await Order.findById(req.params.orderId);
    if (!order) throw new NotFoundError('Order not found');
    if (req.user.role === userRoles.INSPECTION_MANAGER && order.inspection_manager !== req.user._id) {
        throw new ForbiddenError("You don't access to this order, please contact your procurment manager or admin");
    }
    if (req.user.role === userRoles.PROCUREMENT_MANAGER && order.procurement_manager !== req.user._id) {
            throw new ForbiddenError("You don't access to this order, please contact admin");
    }
    order.status = status;
    await order.save();
    res.status(statusCode.OK).json(order);
};