const express = require('express');
const PagesControllers = require('../controllers/pagesController.js');
const upload = require('../middleware/upload.middleware.js');
const router = express.Router();

router.route("/").get(PagesControllers.getAllPages);
router.route("/:id").get(PagesControllers.getPage);
router.route("/:id").put(PagesControllers.updatePage);
router.route("/:id").delete(PagesControllers.erasePage);
router.route("/").post(upload.single('image'), PagesControllers.postPage);



module.exports = router; 