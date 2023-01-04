const { cleaning, docking, getGoalQueueSize, getPosition,
    localise, manageGoals, publishGoal } = require("./ros");
const euclidean_dist = require("euclidean-distance");
const sleep = require("./sleep");

// needs refinement for checks 
const cleaningProcess = async (cleaning_plan) => {
    let home_position = JSON.parse(process.env.HOME_ZONES)[cleaning_plan]

    // checks if robot is at dock and undocks
    // if (euclidean_dist(getPosition, home_position) < 1) {
    //     console.log("Undocking...");
    //     docking("undock");
    // }

    // await sleep(5000);

    // checks if robot is at home position and localises robot
    if (Math.floor(euclidean_dist(getPosition, home_position), 0) == 0) {
        console.log("Localising...");
        localise()
    }

    await sleep(5000);

    // starts cleaning_plan
    cleaning(cleaning_plan);
    console.log("Started cleaning plan.")

    await sleep(10000);

    // checks goal_queue_size every 3 mins
    while (await getGoalQueueSize() > 10) {
        console.log("Cleaning...")
        await sleep(30000);
    }

    // add home position to end of cleaning plan
    publishGoal(home_position);

    // need help to verify this block
    await manageGoals(1, "");
    await sleep(1000);

    while (Math.floor(euclidean_dist(await getPosition, home_position), 0) != 0) {
        console.log("Navigating to home position...")
        if (await getGoalQueueSize == 0) {
            // add home position to end of cleaning plan again if cancelled 
            publishGoal(home_position);
        }

        // execute goal to home position
        await manageGoals(1, "");
        await sleep(1000);
    }
    // till here


    // dock at home 
    // docking("dock");
    // console.log("Docking...")

    console.log("Done.")

}

module.exports = cleaningProcess;