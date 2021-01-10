
var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var Class = new Schema({
    name: {
        type: String,
        trim: true,
    },
    classTeacher: {
        type: String,
        trim: true,
    },
    classType:{
        type: String,
        trim: true,
    },
    student:[]
});

module.exports = mongoose.model('Class', Class);