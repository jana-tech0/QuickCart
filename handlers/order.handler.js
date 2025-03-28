
import mongoose from "mongoose";
import asyncHandler from "express-async-handler";
import OrderModel from "../schemas/order.schema.js";
import ProductModel from "../schemas/product.schema.js";
import { calcPrices } from "../utils/calc.prices.js";

const addOrderItems = asyncHandler(async (req, res) => {
    const { orderItems, shippingAddress, paymentMethod } = req.body;

    if (!orderItems || orderItems.length === 0) {
        res.status(400);
        throw new Error("No order items");
    }

    const itemsFromDB = await ProductModel.find({
        _id: { $in: orderItems.map((x) => x._id) },
    });

    if (itemsFromDB.length !== orderItems.length) {
        res.status(400);
        throw new Error("Some products were not found in the database");
    }


    const dbOrderItems = orderItems.map((itemFromClient) => {
        const matchingItemFromDB = itemsFromDB.find(
            (itemFromDB) => itemFromDB._id.toString() === itemFromClient._id
        );

        if (!matchingItemFromDB) {
            throw new Error(`Product not found: ${itemFromClient._id}`);
        }

        return {
            product: itemFromClient._id,
            name: matchingItemFromDB.name,  
            image: matchingItemFromDB.image,
            price: matchingItemFromDB.price,
            qty: itemFromClient.qty,
        };
    });

    
    const { itemsPrice, taxPrice, shippingPrice, totalPrice } = calcPrices(dbOrderItems);

    const order = new OrderModel({
        orderItems: dbOrderItems,
        user: req.user._id,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
    });

    const createdOrder = await order.save();

    res.status(201).json(createdOrder);
});

const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await OrderModel.find({ user: req.user._id });
  res.json(orders);
});

const getOrderById = asyncHandler(async (req, res) => {
  const order = await OrderModel.findById(req.params.id).populate(
    'user',
    'name email'
  );

  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

const getOrders = asyncHandler(async (req, res) => {
  const orders = await OrderModel.find({}).populate('user', 'id name');
  res.json(orders);
});




export { addOrderItems,getOrders,getMyOrders,getOrderById};


