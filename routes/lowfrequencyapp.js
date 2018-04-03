var express = require('express');
var router = express.Router();

// Require controller modules.
var class_controller = require('../controllers/classController');
var word_controller = require('../controllers/wordController');
var home_controller = require('../controllers/homeController');
var search_controller = require('../controllers/searchController');

// GET home page.
router.get('/', home_controller.home_page);

// POST home page.
router.post('/search', search_controller.search);

// POST get_frequency
router.post('/search/get_frequency', search_controller.get_frequency)

/// CLASS ROUTES ///

// GET request for one class.
router.get('/class/:id', class_controller.class_detail);

// GET request for list of all classs.
router.get('/classes', class_controller.class_list);

/// WORD ROUTES ///

// GET request for one word.
router.get('/word/:id', word_controller.word_detail);

// GET request for list of all classs.
router.get('/words', word_controller.word_list);


module.exports = router;
