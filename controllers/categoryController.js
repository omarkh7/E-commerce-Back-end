const Category = require('../models/categoryModel.js')
const Product = require('../models/productModel.js')
const asyncHandler = require('express-async-handler');



// ee

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
        product_id: req.body.product_id

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


// const Category = require('../models/categoryModel');

// // Get all categories
// const getAllCategories = async (req, res) => {
//     try {
//         const categories = await Category.find();
//         res.json(categories);
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// }

// // Get a single category by ID
// const getCategory = async (req, res) => {
//     try {
//         const category = await Category.findById(req.params.id);
//         res.json(category);
//     } catch (err) {
//         res.status(404).json({ message: 'Category not found' });
//     }
// }

// // Create a new category
// const postCategory = async (req, res) => {
//     const category = new Category({
//         name: req.body.name
//     });
//     try {
//         const newCategory = await category.save();
//         res.status(201).json(newCategory);
//     } catch (err) {
//         res.status(400).json({ message: err.message });
//     }
// }

// // Update an existing category by ID
// const updateCategory = async (req, res) => {
//     try {
//         const category = await Category.findById(req.params.id);
//         if (category) {
//             category.name = req.body.name || category.name;
//             const updatedCategory = await category.save();
//             res.json(updatedCategory);
//         } else {
//             res.status(404).json({ message: 'Category not found' });
//         }
//     } catch (err) {
//         res.status(400).json({ message: err.message });
//     }
// }

// // Delete a category by ID
// const eraseCategory = async (req, res) => {
//     try {
//         const category = await Category.findById(req.params.id);
//         if (category) {
//             await category.remove();
//             res.json({ message: 'Category deleted' });
//         } else {
//             res.status(404).json({ message: 'Category not found' });
//         }
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// }

// module.exports = {
//      getAllCategories,
//     getCategory,
//     postCategory,
//     updateCategory,
//     eraseCategory
// };
