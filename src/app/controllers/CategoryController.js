import asyncHandler from "express-async-handler";
import CategoryModel from "../models/categoryModel.js";
import path from "path";
const __dirname = path.resolve();

const getAllCategory = asyncHandler(async (req, res, next) => {
  try {
    const categoryList = await CategoryModel.find({}).lean();

    res.render(path.join(__dirname + "/src/views/categories.handlebars"), {
      layout: path.join(
        __dirname + "/src/views/layout/admin-sidebar.handlebars"
      ),
      category: categoryList,
    });
  } catch (error) {
    console.log(error);
  }
});

const createCategoryView = asyncHandler(async (req, res) => {
  try {
    res.render(path.join(__dirname + "/src/views/createCategory.handlebars"), {
      layout: path.join(
        __dirname + "/src/views/layout/admin-sidebar.handlebars"
      ),
    });
  } catch (error) {
    console.log(error);
  }
});

const capitalizeTitle = (title) => {
  return title
    .toLowerCase()
    .split(" ")
    .map((item) => {
      const firstChar = item.split("")[0].toUpperCase();
      return item.replace(item.split("")[0], firstChar);
    })
    .join(" ");
};

const optimizeQuery = (query) => {
  return query?.toLowerCase().replace(" ", "-");
};

const createCategory = asyncHandler(async (req, res) => {
  try {
    const { title, query } = req.body;
    const newTitle = capitalizeTitle(title);

    const newQuery = optimizeQuery(query);

    const newCate = await CategoryModel.create({
      title: newTitle,
      query: newQuery,
    });

    await newCate.save();

    res.redirect("/admin/category");
  } catch (error) {
    console.log(error);
  }
});

const getCateDetail = asyncHandler(async (req, res) => {
  try {
    const cateDetail = await CategoryModel.findById(req.params.id);
    const { title, query, _id } = cateDetail;

    res.render(path.join(__dirname + "/src/views/editCategory.handlebars"), {
      layout: path.join(
        __dirname + "/src/views/layout/admin-sidebar.handlebars"
      ),
      id: _id,
      title: title,
      query: query,
    });
  } catch (error) {
    console.log(error);
  }
});

const updateCateDetail = asyncHandler(async (req, res) => {
  try {
    const cateDetail = await CategoryModel.findById(req.params.id);
    const { title, query } = req.body;

    const newTitle = capitalizeTitle(title)
    const newQuery = optimizeQuery(query)

    if (cateDetail) {
      cateDetail.title = newTitle;
      cateDetail.query = newQuery;
    }
    await cateDetail.save();

    res.redirect("/admin/category");
  } catch (error) {
    console.log(error);
  }
});

const deleteCateDetail = asyncHandler(async (req, res) => {
  try {
    const cateDetail = await CategoryModel.findById(req.params.id)
    if(!cateDetail) {
      return
    }

    await cateDetail.remove()
    res.redirect("/admin/category");
  } catch (error) {
    console.log(error);
  }
})

export {
  getAllCategory,
  createCategory,
  createCategoryView,
  getCateDetail,
  updateCateDetail,
  deleteCateDetail
};
