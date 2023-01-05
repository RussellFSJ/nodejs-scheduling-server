const { cleaning, docking, getGoalQueueSize, getPosition,
    localise, manageGoals, publishGoal } = require("./ros");
const euclidean_dist = require("euclidean-distance");
// const roundToDown = require("round-to").roundToDown;
const sleep = require("./sleep");

// needs refinement for checks 
const cleaningProcess = async (cleaning_plan) => {
    
    let home_position = JSON.parse(process.env.HOME_ZONES)[cleaning_plan]
    
    
    // checks if robot is at dock and undocks
    if (euclidean_dist(getPosition, home_position) < 1) {
        console.log("Undocking...");
        docking("undock");
    }

    sleep(5000);

    
    // checks if robot is at home position and localises robot
    if (Math.floor(euclidean_dist(getPosition, home_position), 0) == 0) {
        console.log("Localising...");
        localise()
    }
    
    sleep(5000);
    
    // starts cleaning_plan
    cleaning(cleaning_plan);
    console.log("Started cleaning plan.")
    
    // This sleep is important because it takes some time for cleaning goals to be sent
    sleep(5000);
    
    // checks goal_queue_size every 3 mins
    let goal_queue_size = await getGoalQueueSize()
    console.log(goal_queue_size)
    
    while (goal_queue_size > 10 || goal_queue_size == -1) {
        console.log("Cleaning...")
        sleep(180000);
    }

    // add home position to end of cleaning plan
    publishGoal(home_position);

    while (Math.floor(euclidean_dist(getPosition, home_position), 0)) {
        console.log("Navigating to home position...")
        goal_queue_size = await getGoalQueueSize()
        if (goal_queue_size == 0) {
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