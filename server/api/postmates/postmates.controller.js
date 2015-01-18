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

exports.order = function(req, res) {
    //manifest="a box of kittens"
    //pickup_name="The Warehouse"
    //pickup_address="20 McAllister St, San Francisco, CA"
    //pickup_phone_number="555-555-5555"
    //pickup_business_name="Optional Pickup Business Name, Inc."
    //pickup_notes="Optional note that this is Invoice #123"
    //dropoff_name="Alice"
    //dropoff_address="101 Market St, San Francisco, CA"
    //dropoff_phone_number="415-555-1234"
    //dropoff_business_name="Optional Dropoff Business Name, Inc."
    //dropoff_notes="Optional note to ring the bell"
    //quote_id=qUdje83jhdk
    if(!req.user) {
        return res.status(401).send('You need to be logged in');
    }

    console.log(req.body);

    request.post(
        {
            url:'https://api.postmates.com/v1/customers/cus_KAbDYsMSAz-3Yk/deliveries',
            form: {
                'manifest'              : req.body.manifest,
                'pickup_name'           : req.body.pickup_name,
                'pickup_address'        : req.body.pickup_address,
                'pickup_phone_number'   : req.body.pickup_phone_number,
                'pickup_business_name'  : req.body.pickup_business_name,
                'pickup_notes'          : req.body.pickup_notes,
                'dropoff_name'          : req.body.dropoff_name,
                'dropoff_address'       : req.body.dropoff_address,
                'dropoff_phone_number'  : req.body.dropoff_phone_number,
                //'dropoff_business_name' : "Optional Dropoff Business Name, Inc.",
                'dropoff_notes'         : req.body.dropoff_notes,
                'quote_id'              : req.body.quote_id
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
