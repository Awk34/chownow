/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Postmates = require('./postmates.model');

exports.register = function (socket) {
    Postmates.schema.post('save', function (doc) {
        onSave(socket, doc);
    });
    Postmates.schema.post('remove', function (doc) {
        onRemove(socket, doc);
    });
}

function onSave(socket, doc, cb) {
    socket.emit('postmates:save', doc);
}

function onRemove(socket, doc, cb) {
    socket.emit('postmates:remove', doc);
}
