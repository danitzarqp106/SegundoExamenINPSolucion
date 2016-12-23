var express = require('express');
var router = express.Router();
//var ctrlLocations = require('../controllers/locations');
var ctrlEditoriales = require('../controllers/editoriales');
var ctrlReviews = require('../controllers/reviews');
/*
router.get('/locations', ctrlLocations.locationsListByDistance);
router.post('/locations', ctrlLocations.locationsCreate);
router.get('/locations/:locationid', ctrlLocations.locationsReadOne);
router.put('/locations/:locationid', ctrlLocations.locationsUpdateOne);
router.delete('/locations/:locationid', ctrlLocations.locationsDeleteOne);
*/

router.get('/editoriales', ctrlEditoriales.editorialesList);
router.post('/editoriales', ctrlEditoriales.editorialesCreate);
router.get('/editoriales/:editorialid', ctrlEditoriales.editorialesReadOne);
router.put('/editoriales/:editorialid', ctrlEditoriales.editorialesUpdateOne);
router.delete('/editoriales/:editorialid', ctrlEditoriales.editorialesDeleteOne);



// reviews
/*
router.post('/locations/:locationid/reviews', ctrlReviews.reviewsCreate);
router.get('/locations/:locationid/reviews/:reviewid', ctrlReviews.reviewsReadOne);
router.put('/locations/:locationid/reviews/:reviewid', ctrlReviews.reviewsUpdateOne);
router.delete('/locations/:locationid/reviews/:reviewid', ctrlReviews.reviewsDeleteOne);
*/

router.post('/editoriales/:editorialid/reviews', ctrlReviews.reviewsCreate);
router.get('/editoriales/:editorialid/reviews/:reviewid', ctrlReviews.reviewsReadOne);
router.put('/editoriales/:editorialid/reviews/:reviewid', ctrlReviews.reviewsUpdateOne);
router.delete('/editoriales/:editorialid/reviews/:reviewid', ctrlReviews.reviewsDeleteOne);

module.exports = router;
