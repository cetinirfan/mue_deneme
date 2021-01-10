var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var Result = new Schema({
    percentQuestion: {
        type: String,
        trim: true,
    },
    countQuestion: {
        type: String,
        trim: true,
    },
    emptyQuestion: {
        type: String,
        trim: true,
    },
    correctQuestion: {
        type: String,
        trim: true,
    },
    wrongQuestion: {
        type: String,
        trim: true,
    },
    netQuestion: {
        type: String,
        trim: true,
    },
    testName: {
        type: String,
        trim: true,
    },
    testID: {
        type: String,
        trim: true,
    },
    userID: {
        type: String,
        trim: true,
    },
    userName: {
        type: String,
        trim: true,
    },
});

module.exports = mongoose.model('Result', Result);