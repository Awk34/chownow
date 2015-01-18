'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var HackSchema = new Schema({
    name: String,
    tagline: String,
    description: String,
    fileId: mongoose.Schema.ObjectId,
    imageId: mongoose.Schema.ObjectId,
    tags: [String],
    author: {
        id: mongoose.Schema.ObjectId,
        imageId: mongoose.Schema.ObjectId,
        name: String
    },
    date: Date
});

module.exports = mongoose.model('Hack', HackSchema);
