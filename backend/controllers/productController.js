import expressAsyncHandler from "express-async-handler";
import Product from "../models/productModel.js";

const getProducts = expressAsyncHandler(async (req, res) => {

  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1

  const keyword = req.query.keyword ? {
    name: {
      $regex: req.query.keyword,
      $options: 'i'
    }
  } : {}

  const count = await Product.countDocuments({ ...keyword })
  const products = await Product.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1))

  res.json({ products, page, pages: Math.ceil(count / pageSize) });

})

const getProductById = expressAsyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.json(product)
  } else {
    res.status(404)
    throw new Error("Product not found")
  }
})

const deleteProduct = expressAsyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    await product.remove();
    res.json({ message: 'Product removed' })
  } else {
    res.status(404)
    throw new Error("Product not found")
  }
})

const createProduct = expressAsyncHandler(async (req, res) => {
  const product = new Product({
    name: "Sample Product",
    price: 0,
    user: req.user._id,
    image: '/images/sample.jpg',
    brand: 'Sample brand',
    category: 'Sample Category',
    countInStock: 0,
    numReviews: 0,
    description: 'Sample description'
  })

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
})


const updateProduct = expressAsyncHandler(async (req, res) => {

  const { name, price, image, brand, category, countInStock, description } = req.body;

  const product = await Product.findById(req.params.id)

  if (product) {
    product.name = name;
    product.price = price;
    product.image = image;
    product.brand = brand;
    product.category = category;
    product.description = description;
    product.countInStock = countInStock;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error("Product not found")
  }

})

const createProductReview = expressAsyncHandler(async (req, res) => {

  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id)

  if (product) {
    const alreadyReviewd = product.reviews.find(r => r.user.toString() === req.user._id.toString())

    if (alreadyReviewd) {
      res.status(400)
      throw new Error('Product Already Reviewed')
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id
    }

    product.reviews.push(review);

    product.numReviews = product.reviews.length;

    product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length

    await product.save()
    res.status(201).json({ message: 'Review Added' });
  } else {
    res.status(404);
    throw new Error("Product not found")
  }

})

const getTopProducts = expressAsyncHandler(async (req, res) => {

  const products = await Product.find({}).sort({ rating: -1 }).limit(3)

  res.json(products)

})


export {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
  createProductReview,
  getTopProducts
}