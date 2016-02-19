'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (robot) {
    robot.respond(/hello/, function (res) {
        res.send('world');
    });
};

module.exports = exports['default'];