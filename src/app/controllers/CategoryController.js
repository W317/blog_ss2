import asyncHandler from "express-async-handler";
import CategoryModel from "../models/categoryModel.js";
import path from "path";
const __dirname = path.resolve();

const getAllCategory = asyncHandler(async (req, res, next) => {
  try {
    const PAGE_SIZE = 12;
    let page = req.query.page;
    //count total page
    const totalData = await CategoryModel.countDocuments();

    const totalPage = Math.ceil(totalData / PAGE_SIZE);

    // if (page) {
    if (page < 1) {
      page = 1;
    }
    if (page > totalPage) {
      page = totalPage
    }
    page = parseInt(page);
    const skipData = (page - 1) * PAGE_SIZE;
    const categoryList = await CategoryModel.find({}).lean()
      .skip(skipData)
      .limit(PAGE_SIZE);

    const pages = [];
    for (let i = 1; i < totalPage + 1; i++) {
      pages.push(i);
    }

    // for button pre and next in pagination
    let currentPage = parseInt(req.query.page)
    if (!page) {
      currentPage = 1
    }
    const hasPrev = currentPage > 1;
    const prev = currentPage - 1;

    const hasNext = currentPage < totalPage;
    const next = currentPage + 1;

    const isActive = (page) => {
      return currentPage === page;
    };

    res.render(path.join(__dirname + "/src/views/categories.handlebars"), {
      layout: path.join(
        __dirname + "/src/views/layout/admin-sidebar.handlebars"
      ),
      category: categoryList,
      pages: pages.map((page) => ({
        page,
        active: isActive(page),
      })),
      currentPage,
      hasPrev,
      prev,
      hasNext,
      next
    });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
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
    const cateDetail = await CategoryModel.findByIdAndDelete(req.params.id);
    if (!cateDetail) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(204).redirect("back");
  } catch (error) {
    console.log(error);
  }
})

const deleteManyCate = asyncHandler(async (req, res) => {
  try {
    const ids = req.body['ids[]'];
    if (!ids) {
      return res.status(400).json({ message: "Bad Request" });
    }
    const result = await CategoryModel.deleteMany({ _id: { $in: ids } });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Categorys not found" });
    }
    res.status(204).redirect('back');
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

export {
  getAllCategory,
  createCategory,
  createCategoryView,
  getCateDetail,
  updateCateDetail,
  deleteCateDetail,
  deleteManyCate
};
