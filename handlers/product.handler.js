import asyncHandler from "express-async-handler";
import ProductModel from '../schemas/product.schema.js';


// Fetch all products    GET /api/products   Public

// GET http://localhost:3000/api/products
// GET http://localhost:3000/api/products?page=2 
// GET http://localhost:3000/api/products?keyword=iphone

const getProducts = asyncHandler(async (req, res) => {
    const pageSize = 4;
    const page = Number(req.query.page) || 1;

    const keyword = req.query.keyword
        ? { name: { $regex: req.query.keyword, $options: "i" } } // Case-insensitive search
        : {};

    console.log("🔍 MongoDB Query:", JSON.stringify(keyword)); // Debugging

    const count = await ProductModel.countDocuments({ ...keyword });
    const products = await ProductModel.find({ ...keyword })
        .limit(pageSize)
        .skip(pageSize * (page - 1));

    res.json({ products, page, pages: Math.ceil(count / pageSize) });
});



// Create a product   POST /api/products    Private/Admin
//POST http://localhost:3000/api/products

const createProduct = asyncHandler(async(req,res) => {
    const product = new ProductModel({
        name: 'Sample name',
        price: 0,
        user: req.user._id,
        image: '/images/sample.jpg',
        brand: 'Sample brand',
        category: 'Sample category',
        countInStock: 0,
        numReviews: 0,
        description: 'Sample description',
    });

    const createProduct = await product.save();
    res.status(201).json(createProduct)
})

const createProductReview = asyncHandler(async(req,res) => {
     const { rating, comment }  = req.body;
     const product = await ProductModel.findById(req.params.id);

    if(!product) {
       res.status(404);
       throw new Error("Product not found")
    }

    const alreadyReviewed = product.reviews.some(
        (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
        res.status(400);
        throw new Error("You have already reviewed this product.");
    }

    const review = {
        name: req.user.name,
        rating: Number(rating),
        comment: comment.trim(),
        user: req.user._id,
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;

    product.rating =
        (
            product.reviews.reduce((acc, item) => item.rating + acc, 0) /
            product.numReviews
        ).toFixed(1);

    await product.save();

    res.status(201).json({
        message: "Review added successfully",
        reviews: product.reviews,
        rating: product.rating,
        numReviews: product.numReviews,
    });



})

const getProductById = asyncHandler(async(req,res) => {
    const product = await ProductModel.findById(req.params.id);
    if (!product) {
        return res.status(404).json({ error: "Product not found" });
    }
    if(product) {
        return res.json(product);
    }else {
        res.status(404);
        throw new Error("product not found")
    }
});

// Update a product   PUT /api/products/:id   Private/Admin
//PUT http://localhost:3000/api/products/65f123abc789d123ef456gh7

const updateProduct = asyncHandler(async(req,res) => {
    const {name, price, description, image, brand, category, countInStock} = req.body;

    const product = await ProductModel.findById(req.params.id);
    if(!product) {
        res.status(404);
        throw new Error("product not found");
    }

    const updatedData = {
        name: name?.trim() || product.name,
        price: price ?? product.price,
        description: description?.trim() || product.description,
        image: image || product.image,
        brand: brand?.trim() || product.brand,
        category: category?.trim() || product.category,
        countInStock: countInStock ?? product.countInStock,
    };

    

    const updatedProduct = await ProductModel.findByIdAndUpdate(
        req.params.id,
        { $set: updatedData},
        { new: true, runValidators: true}
    )
    res.json({
        message: "product updated successfully",
        product : updateProduct,
    })
})

const deleteProduct = asyncHandler(async(req,res) =>  {
     const deleteProduct = await ProductModel.findByIdAndDelete(req.params.id);

     if(deleteProduct) {
        res.json({
            message: `Product '{deletedProduct.name}' removed successfully`
        })
     }else {
        res.status(404);
        throw new Error("Product not found")
    }
})

const getTopProducts = asyncHandler(async (req, res) => {
    const products = await ProductModel.find({}).sort({ rating: -1 }).limit(3);
  
    res.json(products);
});
  

export { getProducts,createProduct,createProductReview, getProductById, updateProduct,deleteProduct,getTopProducts};