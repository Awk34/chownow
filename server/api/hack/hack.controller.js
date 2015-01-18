'use strict';

var _ = require('lodash');
var Hack = require('./hack.model');

// Get list of hacks
exports.index = function (req, res) {
    Hack.find(function (err, hacks) {
        if (err) {
            return handleError(res, err);
        }
        return res.json(200, hacks);
    });
};

// Get a single hack
exports.show = function (req, res) {
    Hack.findById(req.params.id, function (err, hack) {
        if (err) {
            return handleError(res, err);
        }
        if (!hack) {
            return res.send(404);
        }
        return res.json(hack);
    });
};

// Creates a new hack in the DB.
exports.create = function (req, res) {
    Hack.create(req.body, function (err, hack) {
        if (err) {
            return handleError(res, err);
        }
        return res.json(201, hack);
    });
};

// Updates an existing hack in the DB.
exports.update = function (req, res) {
    if (req.body._id) {
        delete req.body._id;
    }
    Hack.findById(req.params.id, function (err, hack) {
        if (err) {
            return handleError(res, err);
        }
        if (!hack) {
            return res.send(404);
        }
        var updated = _.merge(hack, req.body);
        updated.save(function (err) {
            if (err) {
                return handleError(res, err);
            }
            return res.json(200, hack);
        });
    });
};

// Deletes a hack from the DB.
exports.destroy = function (req, res) {
    Hack.findById(req.params.id, function (err, hack) {
        if (err) {
            return handleError(res, err);
        }
        if (!hack) {
            return res.send(404);
        }
        hack.remove(function (err) {
            if (err) {
                return handleError(res, err);
            }
            return res.send(204);
        });
    });
};

function handleError(res, err) {
    return res.send(500, err);
}
