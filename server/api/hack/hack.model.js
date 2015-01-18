'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var HackSchema = new Schema({
    name: String,
    tagline: String,
    description: String,
    fileId: Schema.ObjectId,
    imageId: Schema.ObjectId,
    tags: [String],
    author: {
        id: Schema.ObjectId,
        imageId: Schema.ObjectId,
        name: String
    },
    date: Date,
    price: Number,
    currency: String,
    purchaseOptions: [
        {
            name: String,
            priceChange: Number
        }
    ]
});

module.exports = mongoose.model('Hack', HackSchema);
