'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var PostmatesSchema = new Schema({
    name: String,
    info: String,
    active: Boolean
});

module.exports = mongoose.model('Postmates', PostmatesSchema);
