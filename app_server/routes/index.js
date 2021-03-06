var express = require('express');
var router = express.Router();
//var ctrlLocations = require('../controllers/locations');
var ctrlEditoriales= require('../controllers/editoriales');
var ctrlOthers = require('../controllers/others');

/* Locations pages */
router.get('/', ctrlOthers.angularApp);
//router.get('/', ctrlEditoriales.homelist);
router.get('/editorial/:editorialid', ctrlEditoriales.editorialInfo);
router.get('/editorial/:editorialid/review/new', ctrlEditoriales.addReview);
router.post('/editorial/:editorialid/review/new', ctrlEditoriales.doAddReview);

/* Other pages */
router.get('/about', ctrlOthers.about);

module.exports = router;
