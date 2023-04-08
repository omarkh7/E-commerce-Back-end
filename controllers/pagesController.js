const Page = require('../models/pagesModel.js')
const asyncHandler = require('express-async-handler');



//getting all Pages
const getAllPages = asyncHandler(async(req, res)=>{
    const all_Pages = await Page.find();

    res.status(200).json({
        message:"getting all Pages",
        status:200,
        data: all_Pages,
    });
});


// getting a specific Page [we can also use findone method ]
const getPage = asyncHandler(async(req, res) => {
   
    const get_Page = await Page.findById(req.params.id);
      // console.log(get_Category)
    if(!get_Page)
    {
          return res.status(400).send({error: 'Unable to find ID'})
  
    }
  
      res.status(200).json({
          message:"getting a specific Page",
          status:200,
          data: get_Page,
      }); 
  });

  const postPage = asyncHandler(async(req, res) => {
    // console.log("req" ,req.file)

    const Pages = req.body.type;
    
    if (!Pages) {
        return res.status(400).send({error: 'Please fill all fields'})
    }
  
    const newPage = await Page.create({
        type: Pages,
        title: req.body.title,
        description: req.body.description,
        image: req.file.filename,
      
    })

    res.status(200).json({ 
        message:"Posted Successfully",
        Status:200,   
        data: newPage,
    })
});

//Updating a Page
const updatePage = asyncHandler(async(req, res) => {
    const PageId = req.params.id
    const update = await Page.findById(PageId);

  if(!update) {
    return res.status(400).json({error: 'unable to find id'})

  }

    const newUpdate = await Page.findByIdAndUpdate(req.params.id, req.body, {
        new:true,
    });

    
    res.status(200).json({
        message:"Updated a specific Page",
        status:200,
        data: newUpdate,
    });
});

//Deleting a Page
const erasePage = asyncHandler(async(req, res)=>{
    
    const erasee = req.params.id;
    const erased = await Page.findByIdAndDelete(erasee);

    if(!erased) {
    return res.status(400).json({message: "Couldn't Delete"})
    
}
    const erase = await Page.findByIdAndDelete(req.params.id);

    res.status(200).json({
        message:"Deleted a Specific Page",
        status:200,
        data: erase
    });
});

module.exports = {
    getAllPages,
    getPage,
    postPage,
    updatePage,
    erasePage
}
