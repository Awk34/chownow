'use strict';

var _ = require('lodash');
var Postmates = require('./postmates.model');
var http = require("http");
var request = require('request');

// Get list of postmatess
exports.index = function (req, res) {
    Postmates.find(function (err, postmatess) {
        if (err) {
            return handleError(res, err);
        }
        return res.json(200, postmatess);
    });
};

// Get a single postmates
exports.show = function (req, res) {
    Postmates.findById(req.params.id, function (err, postmates) {
        if (err) {
            return handleError(res, err);
        }
        if (!postmates) {
            return res.send(404);
        }
        return res.json(postmates);
    });
};

// Creates a new postmates in the DB.
exports.create = function (req, res) {
    Postmates.create(req.body, function (err, postmates) {
        if (err) {
            return handleError(res, err);
        }
        return res.json(201, postmates);
    });
};

// Updates an existing postmates in the DB.
exports.update = function (req, res) {
    if (req.body._id) {
        delete req.body._id;
    }
    Postmates.findById(req.params.id, function (err, postmates) {
        if (err) {
            return handleError(res, err);
        }
        if (!postmates) {
            return res.send(404);
        }
        var updated = _.merge(postmates, req.body);
        updated.save(function (err) {
            if (err) {
                return handleError(res, err);
            }
            return res.json(200, postmates);
        });
    });
};

// Deletes a postmates from the DB.
exports.destroy = function (req, res) {
    Postmates.findById(req.params.id, function (err, postmates) {
        if (err) {
            return handleError(res, err);
        }
        if (!postmates) {
            return res.send(404);
        }
        postmates.remove(function (err) {
            if (err) {
                return handleError(res, err);
            }
            return res.send(204);
        });
    });
};

//
exports.quote = function (req, res) {
    request.post(
        {
            url:'https://api.postmates.com/v1/customers/cus_KAbDYsMSAz-3Yk/delivery_quotes',
            form: {
                'pickup_address'    : req.body.pickup_address,
                'dropoff_address'   : req.body.dropoff_address
            }
        },
        function(err,httpResponse,body){
            if(err)
                handleError(res, err);
            else
                res.status(200).send(body);
        }
    ).auth('d16a16be-e25c-47c6-8415-df5c7006bf21', '');
};

function handleError(res, err) {
    return res.send(500, err);
}
