var request = require('request');
var apiOptions = {
  server : "http://localhost:3000"
};
if (process.env.NODE_ENV === 'production') {
  apiOptions.server = "https://getting-mean-loc8r.herokuapp.com";
}

var _isNumeric = function (n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
};

var _formatDistance = function (distance) {
  var numDistance, unit;
  if (distance && _isNumeric(distance)) {
    if (distance > 1) {
      numDistance = parseFloat(distance).toFixed(1);
      unit = 'km';
    } else {
      numDistance = parseInt(distance * 1000,10);
      unit = 'm';
    }
    return numDistance + unit;
  } else {
    return "?";
  }
};

var _showError = function (req, res, status) {
  var title, content;
  if (status === 404) {
    title = "404, page not found";
    content = "Oh dear. Looks like we can't find this page. Sorry.";
  } else if (status === 500) {
    title = "500, internal server error";
    content = "How embarrassing. There's a problem with our server.";
  } else {
    title = status + ", something's gone wrong";
    content = "Something, somewhere, has gone just a little bit wrong.";
  }
  res.status(status);
  res.render('generic-text', {
    title : title,
    content : content
  });
};

var renderHomepage = function(req, res, responseBody){
  var message;
  if (!(responseBody instanceof Array)) {
    message = "API lookup error";
    responseBody = [];
  } else {
    if (!responseBody.length) {
      message = "No places found nearby";
    }
  }
  res.render('editoriales-list', {
    title: 'Mi blog de Editoriales',
    pageHeader: {
      title: 'Mi Blog',
      strapline: 'Find places to work with wifi near you!'
    },
    sidebar: "controllesr editoriales.",
    editoriales: responseBody,
    message: message
  });
};

/* GET 'home' page */
module.exports.homelist = function(req, res){
  var requestOptions, path;
  path = '/api/editoriales';
  requestOptions = {
    url : apiOptions.server + path,
    method : "GET",
    json : {},
    qs : {
    }
  };
  request(
    requestOptions,
    function(err, response, body) {
     
      renderHomepage(req, res);
    }
  );
};

var getEditorialInfo = function (req, res, callback) {
  var requestOptions, path;
  path = "/api/editoriales/" + req.params.editorialid;
  requestOptions = {
    url : apiOptions.server + path,
    method : "GET",
    json : {}
  };
  request(
    requestOptions,
    function(err, response, body) {
      var data = body;
      if (response.statusCode === 200) {
        
        callback(req, res,data);
      } else {
        _showError(req, res, response.statusCode);
      }
    }
  );
};

var renderDetailPage = function (req, res, locDetail) {
  res.render('editorial-info', {
    title: locDetail.name,
    pageHeader: {title: locDetail.name},
    sidebar: {
      context: 'is on Loc8r because it has accessible wifi and space to sit down with your laptop and get some work done.',
      callToAction: 'If you\'ve been and you like it - or if you don\'t - please leave a review to help other people just like you.'
    },
    editorial: locDetail
  });
};

/* GET 'Location info' page */
module.exports.editorialInfo = function(req, res){
  getEditorialInfo(req, res, function(req, res, responseData) {
    renderDetailPage(req, res, responseData);
  });
};

var renderReviewForm = function (req, res, edDetail) {
  res.render('editorial-review-form', {
    title: 'Review ' + edDetail.name + ' on Loc8r',
    pageHeader: { title: 'Review ' + edDetail.name },
    error: req.query.err
  });
};

/* GET 'Add review' page */
module.exports.addReview = function(req, res){
  getEditorialInfo(req, res, function(req, res, responseData) {
    renderReviewForm(req, res, responseData);
  });
};

/* POST 'Add review' page */
module.exports.doAddReview = function(req, res){
  var requestOptions, path, editorialid, postdata;
  editorialid = req.params.editorialid;
  path = "/api/editoriales/" + editorialid + '/reviews';
  postdata = {
    author: req.body.name,
    rating: parseInt(req.body.rating, 10),
    reviewText: req.body.review
  };
  requestOptions = {
    url : apiOptions.server + path,
    method : "POST",
    json : postdata
  };
  if (!postdata.author || !postdata.rating || !postdata.reviewText) {
    res.redirect('/editorial/' + editorialid + '/reviews/new?err=val');
  } else {
    request(
      requestOptions,
      function(err, response, body) {
        if (response.statusCode === 201) {
          res.redirect('/editorial/' + editorialid);
        } else if (response.statusCode === 400 && body.name && body.name === "ValidationError" ) {
          res.redirect('/editorial/' + editorialid + '/reviews/new?err=val');
        } else {
          console.log(body);
          _showError(req, res, response.statusCode);
        }
      }
    );
  }
};
