export default function(robot) {
    robot.respond(/add (.*) to food list/i, (res) => {
        let newOption = res.match[1],
            oldOptions = robot.brain.get('foodOptions') || [],
            newOptions = [],
            response = `${newOption} is already in food list!`;

        if (oldOptions.indexOf(newOption) === -1) {
            newOptions = [...oldOptions, newOption];
            robot.brain.set('foodOptions', newOptions);
            response = `Successfully added ${newOption} into my brain!`;
        }
        res.send(response);
    });
    robot.respond(/what are the foods you know/i, (res) => {
        let foods = robot.brain.get('foodOptions') || [],
            foodsStr = foods.reduce((result, place) => result + place + '\n', ''),
            response = `I don't have any foods in my mind. Maybe you can teach me some?`;

        if (foods.length !== 0) {
            response = `I know: \n ${foodsStr}`;
        }
        res.send(response);
    });
    robot.respond(/delete (.*) from food list/i, (res) => {
        let foods = robot.brain.get('foodOptions') || [],
            target = res.match[1],
            targetIndex = foods.indexOf(target),
            response = `${target} is not in my food list, nothing deleted.`;

        if (targetIndex !== -1) {
            robot.brain.set('foodOptions',
                [...foods.slice(0, targetIndex), ...foods.slice(targetIndex + 1)]);
            response = `${target} is deleted from food list`;
        }
        res.send(response);
    });
    robot.hear(/what to eat(\?)?$/i, (res) => {
        let foodOptions = robot.brain.get('foodOptions') || [],
            response = `I don't have any foods in my mind. Maybe you can teach me some?`;

        if (foodOptions.length !== 0) {
            response = `How about ${res.random(foodOptions)}?`;
        }
        res.reply(response);
    });
};
