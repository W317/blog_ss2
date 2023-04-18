import Product from "../models/productModel.js";
import asyncHandler from "express-async-handler";
import fs from "fs"

import path from "path";
import CategoryModel from "../models/categoryModel.js";

const __dirname = path.resolve();

const getProducts = asyncHandler(async (req, res) => {
  try {
    // pagination with 2 rows a page
    const PAGE_SIZE = 8;
    let page = req.query.page;
    //count total page
    const totalData = await Product.countDocuments();
    const totalPage = Math.ceil(totalData / PAGE_SIZE);

    // if (page) {
    if (page < 1) {
      page = 1;
    }
    if (page > totalPage) {
      page = totalPage;
    }
    page = parseInt(page);
    const skipData = (page - 1) * PAGE_SIZE;
    const products = await Product.find(
      req.body.category
        ? {
          category: req.body.category,
        }
        : {}
    )
      .lean()
      .skip(skipData)
      .limit(PAGE_SIZE).sort(req.body.sorting ? req.body.sorting : 'ascending')

    let foundProducts = [];
    if (req.body.keyword) {
      products.map((item) => {
        return (
          item?.title.includes(req.body.keyword || "") &&
          foundProducts.push(item)
        );
      });
    } else {
      foundProducts = [...products];
    }

    console.log(foundProducts)

    if (req.body.sorting === 'ascending') {
      foundProducts.sort((item, nextItem) => {
        return item.price - nextItem.price
      })
    } else if (req.body.sorting === 'descending') {
      foundProducts.sort((item, nextItem) => {
        return nextItem.price - item.price
      })
    }

    const pages = [];
    for (let i = 1; i < totalPage + 1; i++) {
      pages.push(i);
    }


    // push 3 blogs into a row
    // let productArray = [];
    // let arraySize = 3;
    // for (let index = 0; index < products.length; index += arraySize) {
    //   productArray.push(products.slice(index, index + arraySize));
    // }

    // for button pre and next in pagination
    let currentPage = parseInt(req.query.page);
    if (!page) {
      currentPage = 1;
    }
    const hasPrev = currentPage > 1;
    const prev = currentPage - 1;

    const hasNext = currentPage < totalPage;
    const next = currentPage + 1;

    const isActive = (page) => {
      return currentPage === page;
    };

    const category = await CategoryModel.find({}).lean();
    // render view
    res.render(path.join(__dirname + "/src/views/shop.handlebars"), {
      layout: path.join(__dirname + "/src/views/layout/main.handlebars"),
      products: foundProducts,
      category: category,
      pages: pages.map((page) => ({
        page,
        active: isActive(page),
      })),
      currentPage,
      hasPrev,
      prev,
      hasNext,
      next,
    });
  } catch (error) {
    console.log(error);
  }
});

const listImage = ["/img/ysl3.jpg"];

const createProduct = asyncHandler(async (req, res) => {
  try {
    const { title, category, description, price, quantity } = req.body;

    const imagePath = req.file ? `/img/${req.file.filename}` : ""; // save the file path if a file was uploaded
    const product = new Product({
      quantity: quantity,
      title: title,
      category: category,
      image: imagePath,
      description: description,
      price: price,
    });

    await product.save();
    res.status(201).redirect("/admin/product-admin");
  } catch (err) {
    console.log(err);
  }
});

const getOneProduct = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).lean();
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.render(path.join(__dirname + "/src/views/single-product.handlebars"), {
      layout: path.join(__dirname + "/src/views/layout/main.handlebars"),
      product: product,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

const updateProduct = asyncHandler(async (req, res) => {
  try {
    console.log(req.body);
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if a new file was uploaded
    if (req.file) {
      // Get the full path to the img directory
      const filePath = path.join(__dirname, '/public', req.body.old_image);

      fs.unlinkSync(filePath);


      // If a new file was uploaded, delete the old image
      const imagePath = req.file ? `/img/${req.file.filename}` : "";
      // Update the product's image with the new file
      product.image = imagePath;
      console.log('this is ' + product.image)
      await product.save();
    }

    res.status(302).redirect("/admin/product-admin");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

const deleteProduct = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(204).redirect("back");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

export {
  createProduct,
  getProducts,
  getOneProduct,
  updateProduct,
  deleteProduct,
};
