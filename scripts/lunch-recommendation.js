'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

exports.default = function (robot) {
    robot.respond(/add (.*) to food list/i, function (res) {
        var newOption = res.match[1],
            oldOptions = robot.brain.get('foodOptions') || [],
            newOptions = [],
            response = newOption + ' is already in food list!';

        if (oldOptions.indexOf(newOption) === -1) {
            newOptions = [].concat((0, _toConsumableArray3.default)(oldOptions), [newOption]);
            robot.brain.set('foodOptions', newOptions);
            response = 'Successfully added ' + newOption + ' into my brain!';
        }
        res.send(response);
    });
    robot.respond(/what are the foods you know/i, function (res) {
        var foods = robot.brain.get('foodOptions') || [],
            foodsStr = foods.reduce(function (result, place) {
            return result + place + '\n';
        }, ''),
            response = 'I don\'t have any foods in my mind. Maybe you can teach me some?';

        if (foods.length !== 0) {
            response = 'I know: \n ' + foodsStr;
        }
        res.send(response);
    });
    robot.respond(/delete (.*) from food list/i, function (res) {
        var foods = robot.brain.get('foodOptions') || [],
            target = res.match[1],
            targetIndex = foods.indexOf(target),
            response = target + ' is not in my food list, nothing deleted.';

        if (targetIndex !== -1) {
            robot.brain.set('foodOptions', [].concat((0, _toConsumableArray3.default)(foods.slice(0, targetIndex)), (0, _toConsumableArray3.default)(foods.slice(targetIndex + 1))));
            response = target + ' is deleted from food list';
        }
        res.send(response);
    });
    robot.hear(/what to eat(\?)?$/i, function (res) {
        var foodOptions = robot.brain.get('foodOptions') || [],
            response = 'I don\'t have any foods in my mind. Maybe you can teach me some?';

        if (foodOptions.length !== 0) {
            response = 'How about ' + res.random(foodOptions) + '?';
        }
        res.reply(response);
    });
};

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

;
module.exports = exports['default'];