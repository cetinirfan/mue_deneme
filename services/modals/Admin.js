
var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var Admin = new Schema({
    fullName: {
        type: String,
        trim: true,
    },
    no:{
        type:String
    },
    tc:{
        type:String
    },
    status:{
        type:Number
    },
    mail:{
        type:String
    },
    telephone: {
        type: String,
        trim: true,
    },
    classType: {
        type: String,
        trim: true,
    },
    className: {
        type: String,
        trim: true,
    },
    password: {
        type: String,
        trim: true,
    },
    test: []
});

module.exports = mongoose.model('Admin', Admin);