const Category = require('../models/categoryModel.js')
const Product = require('../models/productModel.js')
const asyncHandler = require('express-async-handler');

//getting all categories
const getAllCategories = asyncHandler(async(req, res)=>{
    const all_Categories = await Category.find();

    res.status(200).json({
        message:"getting all Categories",
        status:200,
        data: all_Categories,
    });
});


// getting a specific Category [we can also use findone method ]
const getCategory = asyncHandler(async(req, res) => {
   
    const get_Category = await Category.findById(req.params.id);
      // console.log(get_Category)
    if(!get_Category)
    {
          return res.status(400).send({error: 'Unable to find ID'})
  
    }
  
      res.status(200).json({
          message:"getting a specific Category",
          status:200,
          data: get_Category,
      }); 
  });

  const postCategory = asyncHandler(async(req, res) => {

    const category = req.body.name;
    
    if (!category) {
        return res.status(400).send({error: 'Please fill all fields'})
    }
  
    const id_product = req.body.product_id


    if (!id_product) {
        return res.status(400).send({error: 'Please fill all fields'})
    }
    const newCategory = await Category.create({
        name: category,
        product_id: req.body.id_product

    })

    res.status(200).json({
        message:"Posted Successfully",
        Status:200,
        data: newCategory,
    })
});

//Updating a category
const updateCategory = asyncHandler(async(req, res) => {
    const CategoryId = req.params.id
    const update = await Category.findById(CategoryId);

  if(!update) {
    return res.status(400).json({error: 'unable to find id'})

  }

    const newUpdate = await Category.findByIdAndUpdate(req.params.id, req.body, {
        new:true,
    });

    
    res.status(200).json({
        message:"Updated a specific Category",
        status:200,
        data: newUpdate,
    });
});

//Deleting a program
const eraseCategory = asyncHandler(async(req, res)=>{
    
    const erasee = req.params.id;
    const erased = await Category.findByIdAndDelete(erasee);

    if(!erased) {
    return res.status(400).json({message: "Couldn't Delete"})
    
}
    const erase = await Category.findByIdAndDelete(req.params.id);

    res.status(200).json({
        message:"Deleted a specific Category",
        status:200,
        data: erase
    });
});

module.exports = {
    getAllCategories,
    getCategory,
    postCategory,
    updateCategory,
    eraseCategory
}
