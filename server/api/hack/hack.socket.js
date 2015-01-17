/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Hack = require('./hack.model');

exports.register = function(socket) {
  Hack.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Hack.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('hack:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('hack:remove', doc);
}