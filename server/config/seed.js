/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var _ = require('lodash'),
    Q = require('q'),
    Thing = require('../api/thing/thing.model'),
    User = require('../api/user/user.model'),
    Hack = require('../api/hack/hack.model'),
    config = require('./environment'),
    gm = require('gm'),
    moment = require('moment'),

    mongoose = require('mongoose'),
    fs = require('fs'),
    Grid = require('gridfs-stream'),
    Schema = mongoose.Schema,
    gridSchema = new Schema({}, {strict: false}),
    gridModel1 = mongoose.model("gridModel1", gridSchema, "fs.files"),
    gfs,
    conn = mongoose.createConnection(config.mongo.uri);
Grid.mongo = mongoose.mongo;

Thing.find({}).remove(function () {
    Thing.create({
        name: 'Development Tools',
        info: 'Integration with popular tools such as Bower, Grunt, Karma, Mocha, JSHint, Node Inspector, Livereload, Protractor, Jade, Stylus, Sass, CoffeeScript, and Less.'
    }, {
        name: 'Server and Client integration',
        info: 'Built with a powerful and fun stack: MongoDB, Express, AngularJS, and Node.'
    }, {
        name: 'Smart Build System',
        info: 'Build system ignores `spec` files, allowing you to keep tests alongside code. Automatic injection of scripts and styles into your index.html'
    }, {
        name: 'Modular Structure',
        info: 'Best practice client and server structures allow for more code reusability and maximum scalability'
    }, {
        name: 'Optimized Build',
        info: 'Build process packs up your templates as a single JavaScript payload, minifies your scripts/css/images, and rewrites asset names for caching.'
    }, {
        name: 'Deployment Ready',
        info: 'Easily deploy your app to Heroku or Openshift with the heroku and openshift subgenerators'
    });
});

conn.once('open', function(err) {
    if (err) return console.log(err);
    gfs = Grid(conn.db);

    gridModel1.find({}, function (err, gridfiles) {
        if (err) console.log(err);
        else {
            _.forEach(gridfiles, function (file) {
                gfs.remove({_id: file._id}, function (err) {
                    if (err) console.log(err);
                });
            });
        }
    });

    User.find({}).remove(function() {
        var userImageWritestream = gfs.createWriteStream([]);
        userImageWritestream.on('close', function(userImgFile) {
            User.create({
                provider: 'local',
                name: 'Test User',
                email: 'test@test.com',
                password: 'test',
                imageId: userImgFile._id
            }, {
                provider: 'local',
                role: 'admin',
                name: 'Admin',
                email: 'admin@admin.com',
                password: 'admin',
                imageId: userImgFile._id
            })
                .then(function() {
                    console.log('finished populating users');
                    User.find({}, function(err, user) {
                        console.log(user);
                        Hack.find({}).remove(function() {
                            var hacks = [{
                                name: 'Crystal cMoy Free Form Headphone Amplifier',
                                tagline: 'This amp is a handmade work of art',
                                description: 'This headphone amplifier circuit is different to conventional modern construction techniques in that it is air Wired,P2P (peer to peer) or free form wiring just like in the good old Valve days before the intervention of  PCB\'s and the transistor.\n' +
                                'Rather than a traditional enclosure, the hole circuit is encapsulated in polyester resin to enhance the internals.\n' +
                                'If your reading this and thinking why do you need an amplifier for headphones then click here\n' +
                                'Although allot of cMoy headphone amplifiers are designed to be portable this one is designed for the desktop although a battery pack could be made also.',
                                //fileId: mongoose.Schema.ObjectId,
                                //imageId: mongoose.Schema.ObjectId,
                                tags: ['electronic', 'amplifier'],
                                author: {
                                    id: user._id,
                                    imageId: user.imageId,
                                    name: user.name
                                },
                                date: new Date(),
                                price: 40.00,
                                currency: 'usd',
                                imageUri: 'data/amp.jpg'
                            }, {
                                name: 'USB Condom',
                                tagline: 'Protect your mobile phone from accidental syncing and malware!',
                                description: 'Have you ever plugged your phone into a strange USB port because you really needed a charge and thought: "Gee who could be stealing my data?". We all have needs and sometimes you just need to charge your phone. "Any port in a storm." as the saying goes. Well now you can be a bit safer. "USB Condoms" prevent accidental data exchange when your device is plugged in to another device with a USB cable. USB Condoms achieve this by cutting off the data pins in the USB cable and allowing only the power pins to connect through.Thus, these "USB Condoms" prevent attacks like "juice jacking". ',
                                tags: ['electronic', 'security'],
                                author: {
                                    id: user._id,
                                    imageId: user.imageId,
                                    name: user.name
                                },
                                date: new Date(),
                                price: 10.00,
                                currency: 'usd',
                                imageUri: 'data/usb-condom.jpg'
                            }];

                            var hackPromises = [];
                            _.forEach(hacks, function (hack) {
                                hackPromises.push(createHack(hack));
                            });

                            Q.allSettled(hackPromises)
                                .then(function (results) {
                                    console.log('finished populating posts');
                                });
                        });
                    });
                });
        });
        fs.createReadStream('data/andrew-koroluk.jpg').pipe(userImageWritestream);
    });

    //User.find({}).remove(function () {
    //    User.create({
    //            provider: 'local',
    //            name: 'Test User',
    //            email: 'test@test.com',
    //            password: 'test'
    //        }, {
    //            provider: 'local',
    //            role: 'admin',
    //            name: 'Admin',
    //            email: 'admin@admin.com',
    //            password: 'admin'
    //        }, function () {
    //            console.log('finished populating users');
    //        }
    //    );
    //});
    //
    //Hack.find({}).remove(function () {
    //    Hack.create({
    //        name: 'Crystal cMoy Free Form Headphone Amplifier',
    //        description: 'This headphone amplifier circuit is different to conventional modern construction techniques in that it is air Wired,P2P (peer to peer) or free form wiring just like in the good old Valve days before the intervention of  PCB\'s and the transistor.\n' +
    //            'Rather than a traditional enclosure, the hole circuit is encapsulated in polyester resin to enhance the internals.\n' +
    //            'If your reading this and thinking why do you need an amplifier for headphones then click here\n' +
    //            'Although allot of cMoy headphone amplifiers are designed to be portable this one is designed for the desktop although a battery pack could be made also.'
    //    }, {
    //        name: 'Server and Client integration',
    //        description: 'Built with a powerful and fun stack: MongoDB, Express, AngularJS, and Node.'
    //    }, {
    //        name: 'Smart Build System',
    //        description: 'Build system ignores `spec` files, allowing you to keep tests alongside code. Automatic injection of scripts and styles into your index.html'
    //    }, {
    //        name: 'Modular Structure',
    //        description: 'Best practice client and server structures allow for more code reusability and maximum scalability'
    //    }, {
    //        name: 'Optimized Build',
    //        description: 'Build process packs up your templates as a single JavaScript payload, minifies your scripts/css/images, and rewrites asset names for caching.'
    //    }, {
    //        name: 'Deployment Ready',
    //        description: 'Easily deploy your app to Heroku or Openshift with the heroku and openshift subgenerators'
    //    });
    //});
});

function createHack(hack) {
    var deferred = Q.defer();

    var writestream = gfs.createWriteStream([]);
    writestream.on('close', function(file) {
        console.log(file.name+' -> '+file._id);
        hack.imageId = file._id;

        Hack.create(hack)
            .then(function(result) {
                deferred.resolve(result);
            });
    });
    fs.createReadStream(hack.imageUri).pipe(writestream);

    return deferred.promise;
}
