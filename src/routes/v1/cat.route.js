const express = require('express');
const catController = require('../../controllers/cat.controller');

const router = express.Router();

router.route('/').post(catController.createCat);

module.exports = router;
