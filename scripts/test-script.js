module.exports = function(robot) {
    robot.respond(/hello|hi/, function(res) {
        res.send('world');
    });
};
