const express = require('express');
const PagesControllers = require('../controllers/pagesController.js');
const upload = require('../middleware/uploadMiddleware.js');
const router = express.Router();

router.route("/getallpages").get(PagesControllers.getAllPages);
router.route("/getallpagesbyid/:id").get(PagesControllers.getPage);
router.route("/createpage").post(upload.single('image'), PagesControllers.postPage);
router.route("/updatepage/:id").put(upload.single('image'),PagesControllers.updatePage);
router.route("/deletepage/:id").delete(PagesControllers.erasePage);



module.exports = router; 