const { cleaning, docking, getGoalQueueSize, getPosition,
    localise, manageGoals, publishGoal } = require("./ros");
const euclidean_dist = require("euclidean-distance");
const roundToDown = require("round-to").roundToDown;
const sleep = require("./sleep");

// needs refinement for checks 
const cleaningProcess = (cleaning_plan) => {
    let home_position = JSON.parse(process.env.HOME_ZONES)[cleaning_plan]

    // checks if robot is at dock and undocks
    if (euclidean_dist(getPosition, home_position) < 1) {
        console.log("Undocking...");
        docking("undock");
    }

    sleep(5000);

    // checks if robot is at home position and localises robot
    if (roundToDown(euclidean_dist(getPosition, home_position), 0) == 0) {
        console.log("Localising...");
        localise()
    }

    sleep(5000);

    // starts cleaning_plan
    cleaning(cleaning_plan);
    console.log("Started cleaning plan.")

    // checks goal_queue_size every 3 mins
    while (getGoalQueueSize() > 10) {
        console.log("Cleaning...")
        sleep(180000);
    }

    // add home position to end of cleaning plan
    publishGoal(home_position);

    while (roundToDown(euclidean_dist(getPosition, home_position), 0)) {
        console.log("Navigating to home position...")
        if (getGoalQueueSize == 0) {
            // add home position to end of cleaning plan again if cancelled 
            publishGoal(home_position);
            // execute goal to home position
            manageGoals(1, "");
        }
        sleep(1000);
    }

    // dock at home 
    docking("dock");
    console.log("Docking...")

    console.log("Done.")

}

module.exports = cleaningProcess;