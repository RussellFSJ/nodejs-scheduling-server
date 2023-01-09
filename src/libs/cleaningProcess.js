const { cleaning, docking, getGoalQueueSize, getPosition,
    localise, manageGoals, publishGoal } = require("./ros");
const euclidean_dist = require("euclidean-distance");
const sleep = require("./sleep");

// needs refinement for checks 
const cleaningProcess = async (cleaning_plan) => {
    let home_position = JSON.parse(process.env.HOME_ZONES)[cleaning_plan]
    let robot_position = await getPosition();

    // console.log(robot_position);
    // console.log(euclidean_dist(robot_position.slice(0, 2), home_position.slice(0, 2)))

    // checks if robot is at dock and undocks
    if (euclidean_dist(robot_position.slice(0, 2), home_position.slice(0, 2)) < 1) {
        console.log("Undocking...");
        docking("undock");
    }

    // console.log(robot_position);
    // console.log(euclidean_dist(robot_position.slice(0, 2), home_position.slice(0, 2)))

    while (Math.floor(euclidean_dist(robot_position.slice(0, 2), home_position.slice(0, 2)), 0) != 0) {
        await sleep(5000);
        robot_position = await getPosition();
    }

    // console.log(robot_position)
    // console.log(Math.floor(euclidean_dist(robot_position.slice(0, 2), home_position.slice(0, 2)), 0))

    console.log("Localising...");
    localise();

    // checks if robot is at home position and localises robot
    // if (Math.floor(euclidean_dist(await getPosition(), home_position), 0) == 0) {
    //     console.log("Localising...");
    //     localise();
    // }

    await sleep(5000);

    // starts cleaning_plan
    await cleaning(cleaning_plan);
    await sleep(10000);
    console.log("Started cleaning plan.")

    // checks goal_queue_size every 30s
    while (await getGoalQueueSize() > 10) {
        console.log("Cleaning...")
        await sleep(30000);
    }

    // add home position to end of cleaning plan
    publishGoal(home_position);

    await sleep(10000);

    await manageGoals(0, "");

    // console.log(robot_position);
    // console.log(euclidean_dist(robot_position.slice(0, 2), home_position.slice(0, 2)))

    while (Math.floor(euclidean_dist(robot_position.slice(0, 2), home_position.slice(0, 2))) != 0) {
        console.log("Navigating to home position...")

        if (await getGoalQueueSize() == 0) {
            // add home position to end of cleaning plan again if cancelled 
            publishGoal(home_position);
        }
        await manageGoals(0, "");

        await sleep(5000);
        robot_position = await getPosition();
    }

    // await manageGoals(0, "");
    console.log(robot_position)
    console.log(Math.floor(euclidean_dist(robot_position, home_position), 0))

    // dock at home 
    docking("dock");
    console.log("Docking...");

    await sleep(10000);

    robot_position = await getPosition();

    console.log(robot_position);
    console.log(euclidean_dist(robot_position.slice(0, 2), home_position.slice(0, 2)))

    if (euclidean_dist(robot_position.slice(0, 2), home_position.slice(0, 2)) < 1) {
        console.log("Done.");
    }
}

module.exports = cleaningProcess;