const express = require('express')
const PagesControllers = require('../controllers/pagesController.js')

const router = express.Router();

router.route("/").get(PagesControllers.getAllPages);
router.route("/:id").get(PagesControllers.getPage);
router.route("/").post(PagesControllers.postPage);
router.route("/:id").put(PagesControllers.updatePage);
router.route("/:id").delete(PagesControllers.erasePage);
// router.route("/:id").delete(CategoryController.eraseCategory);



module.exports = router;