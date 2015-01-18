'use strict';

var _ = require('lodash'),
    Q = require('q'),
    path = require('path'),
    File = require('./file.model'),
    config = require('../../config/environment'),
    mongoose = require('mongoose'),
    fs = require('fs'),
    gridform = require('gridform'),
    gm = require('gm'),
    Schema = mongoose.Schema,
    Grid = require('gridfs-stream'),
    gridSchema = new Schema({}, {strict: false}),
    gridModel = mongoose.model("gridModel", gridSchema, "fs.files"),
    gfs,
    conn = mongoose.createConnection(config.mongo.uri);

gridform.mongo = mongoose.mongo;
Grid.mongo = mongoose.mongo;

conn.once('open', function(err) {
    if(err) {
        handleError(err);
    } else {
        gfs = Grid(conn.db);
        gridform.db = conn.db;
    }
});

// Get list of files
exports.index = function (req, res) {
    File.find(function (err, files) {
        if (err) {
            return handleError(res, err);
        }
        return res.json(200, files);
    });
};

// Get a single file
//exports.show = function (req, res) {
//    File.findById(req.params.id, function (err, file) {
//        if (err) {
//            return handleError(res, err);
//        }
//        if (!file) {
//            return res.send(404);
//        }
//        return res.json(file);
//    });
//};
exports.show = function(req, res) {
    if(req.params.id.substring(24) === '.jpg') {
        req.params.id = req.params.id.substring(0, 24);
    }
    if(!isValidObjectId(req.params.id)) {
        return res.status(400).send('Invalid ID');
    }
    gfs.exist({_id: req.params.id}, function(err, found) {
        if(err) return handleError(err);
        else if(!found) return res.status(404).end();
        else {
            res.header('Content-Type', 'image/jpeg');
            gfs.createReadStream({ _id: req.params.id })
                .on('error', function (err){
                    return handleError(res, err)
                })
                .pipe(res);
        }
    });
};

// Creates a new file in the DB.
exports.create = function (req, res) {
    File.create(req.body, function (err, file) {
        if (err) {
            return handleError(res, err);
        }
        return res.json(201, file);
    });
};

// Updates an existing file in the DB.
exports.update = function (req, res) {
    if (req.body._id) {
        delete req.body._id;
    }
    File.findById(req.params.id, function (err, file) {
        if (err) {
            return handleError(res, err);
        }
        if (!file) {
            return res.send(404);
        }
        var updated = _.merge(file, req.body);
        updated.save(function (err) {
            if (err) {
                return handleError(res, err);
            }
            return res.json(200, file);
        });
    });
};

// Deletes a file from the DB.
exports.destroy = function (req, res) {
    File.findById(req.params.id, function (err, file) {
        if (err) {
            return handleError(res, err);
        }
        if (!file) {
            return res.send(404);
        }
        file.remove(function (err) {
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

function isValidObjectId(objectId) {
    return new RegExp("^[0-9a-fA-F]{24}$").test(objectId);
}
