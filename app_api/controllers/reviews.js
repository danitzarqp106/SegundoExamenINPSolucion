var mongoose = require('mongoose');
var Editorial = mongoose.model('Editorial');

var sendJSONresponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};

/* POST a new review, providing a locationid */
/* /api/locations/:locationid/reviews */
module.exports.reviewsCreate = function(req, res) {
  if (req.params.editorialid) {
    Editorial
      .findById(req.params.editorialid)
      .select('reviews')
      .exec(
        function(err, editorial) {
          if (err) {
            sendJSONresponse(res, 400, err);
          } else {
            doAddReview(req, res, editorial);
          }
        }
    );
  } else {
    sendJSONresponse(res, 404, {
      "message": "Not found, locationid required"
    });
  }
};


var doAddReview = function(req, res, editorial) {
  if (!editorial) {
    sendJSONresponse(res, 404, "locationid not found");
  } else {
    editorial.reviews.push({
      author: req.body.author,
      rating: req.body.rating,
      reviewText: req.body.reviewText
    });
    editorial.save(function(err, editorial) {
      var thisReview;
      if (err) {
        sendJSONresponse(res, 400, err);
      } else {
        updateAverageRating(editorial._id);
        thisReview = editorial.reviews[editorial.reviews.length - 1];
        sendJSONresponse(res, 201, thisReview);
      }
    });
  }
};

var updateAverageRating = function(editorialid) {
  console.log("Update rating average for", editorialid);
  Editorial
    .findById(editorialid)
    .select('reviews')
    .exec(
      function(err, editorial) {
        if (!err) {
          doSetAverageRating(editorial);
        }
      });
};

var doSetAverageRating = function(editorial) {
  var i, reviewCount, ratingAverage, ratingTotal;
  if (editorial.reviews && editorial.reviews.length > 0) {
    reviewCount = editorial.reviews.length;
    ratingTotal = 0;
    for (i = 0; i < reviewCount; i++) {
      ratingTotal = ratingTotal + editorial.reviews[i].rating;
    }
    ratingAverage = parseInt(ratingTotal / reviewCount, 10);
    editorial.rating = ratingAverage;
    editorial.save(function(err) {
      if (err) {
        console.log(err);
      } else {
        console.log("Average rating updated to", ratingAverage);
      }
    });
  }
};

module.exports.reviewsUpdateOne = function(req, res) {
  if (!req.params.editorialid || !req.params.reviewid) {
    sendJSONresponse(res, 404, {
      "message": "Not found, edid and reviewid are both required"
    });
    return;
  }
  Editorial
    .findById(req.params.editorialid)
    .select('reviews')
    .exec(
      function(err, editorial) {
        var thisReview;
        if (!editorial) {
          sendJSONresponse(res, 404, {
            "message": "id not found"
          });
          return;
        } else if (err) {
          sendJSONresponse(res, 400, err);
          return;
        }
        if (editorial.reviews && editorial.reviews.length > 0) {
          thisReview = editorial.reviews.id(req.params.reviewid);
          if (!thisReview) {
            sendJSONresponse(res, 404, {
              "message": "reviewid not found"
            });
          } else {
            thisReview.author = req.body.author;
            thisReview.rating = req.body.rating;
            thisReview.reviewText = req.body.reviewText;
            editorial.save(function(err, editorial) {
              if (err) {
                sendJSONresponse(res, 404, err);
              } else {
                updateAverageRating(editorial._id);
                sendJSONresponse(res, 200, thisReview);
              }
            });
          }
        } else {
          sendJSONresponse(res, 404, {
            "message": "No review to update"
          });
        }
      }
  );
};

module.exports.reviewsReadOne = function(req, res) {
  console.log("Getting single review");
  if (req.params && req.params.editorialid && req.params.reviewid) {
    Editorial
      .findById(req.params.editorialid)
      .select('name reviews')
      .exec(
        function(err, editorial) {
          console.log(editorial);
          var response, review;
          if (!editorial) {
            sendJSONresponse(res, 404, {
              "message": "editorialid not found"
            });
            return;
          } else if (err) {
            sendJSONresponse(res, 400, err);
            return;
          }
          if (editorial.reviews && editorial.reviews.length > 0) {
            review = editorial.reviews.id(req.params.reviewid);
            if (!review) {
              sendJSONresponse(res, 404, {
                "message": "reviewid not found"
              });
            } else {
              response = {
                editorial: {
                  name: editorial.name,
                  id: req.params.editorialid
                },
                review: review
              };
              sendJSONresponse(res, 200, response);
            }
          } else {
            sendJSONresponse(res, 404, {
              "message": "No reviews found"
            });
          }
        }
    );
  } else {
    sendJSONresponse(res, 404, {
      "message": "Not found, locationid and reviewid are both required"
    });
  }
};

// app.delete('/api/locations/:locationid/reviews/:reviewid'
module.exports.reviewsDeleteOne = function(req, res) {
  if (!req.params.editorialid || !req.params.reviewid) {
    sendJSONresponse(res, 404, {
      "message": "Not found, locationid and reviewid are both required"
    });
    return;
  }
  Editorial
    .findById(req.params.editorialid)
    .select('reviews')
    .exec(
      function(err, editorial) {
        if (!editorial) {
          sendJSONresponse(res, 404, {
            "message": "locationid not found"
          });
          return;
        } else if (err) {
          sendJSONresponse(res, 400, err);
          return;
        }
        if (editorial.reviews &&editorial.reviews.length > 0) {
          if (!editorial.reviews.id(req.params.reviewid)) {
            sendJSONresponse(res, 404, {
              "message": "reviewid not found"
            });
          } else {
            editorial.reviews.id(req.params.reviewid).remove();
            editorial.save(function(err) {
              if (err) {
                sendJSONresponse(res, 404, err);
              } else {
                updateAverageRating(editorial._id);
                sendJSONresponse(res, 204, null);
              }
            });
          }
        } else {
          sendJSONresponse(res, 404, {
            "message": "No review to delete"
          });
        }
      }
  );
};
