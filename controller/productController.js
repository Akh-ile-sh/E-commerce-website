const Products = require("../models/Product");
const { StatusCodes } = require("http-status-codes");
const customError = require("../errors");
const path = require("path");

const createProduct = async (req, res) => {
  req.body.user = req.user.userId;
  const product = await Products.create(req.body);
  res.status(StatusCodes.CREATED).json({ product });
};

const getAllProducts = async (req, res) => {
  const products = await Products.find({});
  res.status(StatusCodes.OK).json({ products, count: products.length });
};

const getSingleProduct = async (req, res) => {
  const { id: productId } = req.params;
  const product = await Products.findOne({ _id: productId }).populate(
    "reviews"
  );

  if (!product) {
    throw new customError.NotFoundError(
      `No product with productID ${productId}`
    );
  }

  res.status(StatusCodes.OK).json({ product });
};

const updateProduct = async (req, res) => {
  const { id: productId } = req.params;

  const product = await Products.findOneAndUpdate(
    { _id: productId },
    req.body,
    { new: true, runValidators: true }
  );

  if (!product) {
    throw new customError.NotFoundError(
      `No product with productID ${productId}`
    );
  }

  res.status(StatusCodes.OK).json({ product });
};

const deleteProduct = async (req, res) => {
  const { id: productId } = req.params;

  const product = await Products.findOne({ _id: productId });

  if (!product) {
    throw new customError.NotFoundError(
      `No product with productID ${productId}`
    );
  }

  await product.remove();

  res.status(StatusCodes.OK).json({ msg: "Success!! Product deleted.." });
};

const uploadImage = async (req, res) => {
  if (!req.files) {
    throw new customError.BadRequestError("No file Uploaded");
  }

  const productImage = req.files.foto;
  if (!productImage.mimetype.startsWith("image")) {
    throw new customError.BadRequestError("Please upload an image");
  }

  const maxsize = 2 * 1024 * 1024;
  if (productImage.size > maxsize) {
    throw new customError.BadRequestError(
      "Please upload an image less than 2kb"
    );
  }

  const imagePath = path.join(
    __dirname,
    "../public/uploads/" + `${productImage.name}`
  );
  await productImage.mv(imagePath);

  res.status(StatusCodes.OK).json({ image: `/uploads/${productImage.name}` });
};

module.exports = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
};
