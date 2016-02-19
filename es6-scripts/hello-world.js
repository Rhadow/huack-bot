export default function(robot) {
    robot.respond(/hello/, (res) => {
        res.send('world');
    });
}
