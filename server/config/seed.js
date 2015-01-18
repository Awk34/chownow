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
                            }, {
                                name: 'ATtiny Programming Shield for Arduino',
                                tagline: 'Program ATtiny chips via an Arduino',
                                description: 'This little circuit sits nicely on top of an Arduino board and lets you quickly plug in an ATtiny chip for programming using the Arduino "language" and IDE to write the code, and the Arduino board as an ISP programmer to upload the code to the tiny chip.',
                                tags: ['electronic', 'programming', 'arduino'],
                                author: {
                                    id: user._id,
                                    imageId: user.imageId,
                                    name: user.name
                                },
                                date: new Date(),
                                price: 10.00,
                                currency: 'usd',
                                imageUri: 'data/attiny-shield.jpg'
                            }, {
                                name: 'Arduino home energy monitor shield',
                                tagline: 'Monitors current in your home\'s breaker box',
                                description: 'Although products are becoming more and more available for monitoring your home power usage, I\'m one of those idiots who can\'t leave well enough alone and who would rather shell out $100 and hours of my time in order to save $20 and learn something in the process.  Building on the fine work of Trystan Lea and others at OpenEnergyMonitor.org as well as various and sundry web sources and acquaintances the result is a self-contained Arduino shield for monitoring the energy usage of your home using clamp on current transformers, an ethernet shield, and an Arduino. The resulting Energy Monitoring Shield has a built in switching power supply and with mains voltage (120VAC in the US) to the board can do power factor correction as well.  With mains voltage to the board it is also more dangerous than your typical home electronics project and as such has been rejected for distribution by commercial maker outlets like adafruit and sparkfun.  So take that as a warning, and if in doubt, keep one hand in your pocket and out of puddles when handling the board.',
                                tags: ['electronic', 'monitoring', 'arduino'],
                                author: {
                                    id: user._id,
                                    imageId: user.imageId,
                                    name: user.name
                                },
                                date: new Date(),
                                price: 25.00,
                                currency: 'usd',
                                imageUri: 'data/home-energy-shield.jpg'
                            }, {
                                name: '2-Player Raspberry Pi Arcade Machine',
                                tagline: 'Plays NES, SNES, Megadrive, and arcade (MAME) games',
                                description: 'The \'Galactic Starcade\' is a DIY retro bartop arcade cabinet for two players. It is powered by the Raspberry Pi micro-computer and plays multiple types of retro games - primarily NES, SNES, Megadrive and arcade (MAME) games. Using a Pi keeps the cost, weight and complexity to a minimum but the cabinet could also house a more powerful PC-based system to play more modern games.\n' +
                                    'I\'ve always wanted an arcade machine for authentic retro gaming but they take up a lot of space and cost a lot of money. Making a custom bartop cabinet like this one solves both of those problems. It also lets you play potentially thousands of games on a single machine. This project costs under £200 (approx. $320) to make, whereas a prebuilt custom cabinet can set you back four or five times that amount!' +
                                    'This is my first big DIY project and my first Instructable - be nice! Any questions or feedback are more than welcome in the comments. Also I\'m entering a couple of competitions here on Instructables so if you like the look of the Galactic Starcade please consider voting for me! :)',
                                tags: ['electronic', 'gaming', 'rpi'],
                                author: {
                                    id: user._id,
                                    imageId: user.imageId,
                                    name: user.name
                                },
                                date: new Date(),
                                price: 125.00,
                                currency: 'usd',
                                imageUri: 'data/bartop-arcade.jpg'
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
