const Pages = require("../models/pagesModel.js");
const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");

// iwhfiw

//getting all Pages
const getAllPages = asyncHandler(async (req, res) => {
  const all_Pages = await Pages.find();

  res.status(200).json({
    message: "getting all Pages",
    status: 200,
    data: all_Pages,
  });
});

// getting a specific Page [we can also use findone method ]
const getPage = asyncHandler(async (req, res) => {
  const get_Page = await Pages.findById(req.params.id);
  // console.log(get_Category)
  if (!get_Page) {
    return res.status(400).send({ error: "Unable to find ID" });
  }

  res.status(200).json({
    message: "getting a specific Page",
    status: 200,
    data: get_Page,
  });
});

const postPage = asyncHandler(async (req, res) => {
  // console.log("req" ,req.file)

  const Pagess = req.body.type;

  if (!Pagess) {
    return res.status(400).send({ error: "Please fill all fields" });
  }

  const newPage = await Pages.create({
    type: Pagess,
    title: req.body.title,
    description: req.body.description,
    image: req.file.filename,
  });

  res.status(200).json({
    message: "Posted Successfully",
    Status: 200,
    data: newPage,
  });
});

//Updating a Page

const updatePage = asyncHandler(async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send("Invalid Page Id");
    }
    console.log("BODY", req.body);
    const page = await Pages.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        description: req.body.description,
        image: req.body.image,
        type: req.body.type,
      },
      { new: true }
    );

    if (!page) {
      return res.status(500).send("The page cannot be updated!");
    }

    res.status(200).json({
      message: "Updated a specific Page",
      status: 200,
      data: page,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred while updating the page.");
  }
});

//Deleting a Page
const erasePage = asyncHandler(async (req, res) => {
  const erasee = req.params.id;
  const erased = await Pages.findByIdAndDelete(erasee);

  if (!erased) {
    return res.status(400).json({ message: "Couldn't Delete" });
  }
  const erase = await Pages.findByIdAndDelete(req.params.id);

  res.status(200).json({
    message: "Deleted a Specific Page",
    status: 200,
    data: erase,
  });
});

module.exports = {
  getAllPages,
  getPage,
  postPage,
  updatePage,
  erasePage,
};
