var mongoose = require('mongoose');

var reviewSchema = new mongoose.Schema({
    author: {type: String, required: true},
    rating: {
        type: Number,
        required: true,
        min: 0,
        max: 5
    },
    reviewText: {type: String, required: true},
    createdOn: {
        type: Date,
        "default": Date.now
    }
});

var editorialSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    contenido:String,
    tipo: String,
    rating: {
        type: Number,
        "default": 0,
        min: 0,
        max: 5
    },
    reviews: [reviewSchema]
});
mongoose.model('Editorial', editorialSchema,'editoriales');
//mongoose.model('Location', locationSchema);
