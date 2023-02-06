const { cleaning, docking, getDockingFeedback, getGoalQueueSize, getPosition,
    localise, manageGoals, navigate, publishGoal, changeMap, changeRobotState } = require("./ros");
const euclidean_dist = require("euclidean-distance");
const sleep = require("./sleep");

// needs refinement for checks 
const cleaningProcess = async (cleaning_plan, cleaning_zones) => {
    let message = "";

    try {
        // used for docking and navigating to home zone
        let get_result_count = 0;
        let attempts = 0;

        let home_position = JSON.parse(process.env.HOME_ZONES)[cleaning_plan];
        let robot_position = await getPosition();

        let docking_feedback = await getDockingFeedback();
        console.log(docking_feedback);

        // undock
        docking("undock");

        // checks if undocking is successful, attempts the undock up to 3 times before failing
        while (!docking_feedback.includes("Success")) {
            if (attempts >= 3) {
                message = `Failed to undock after ${attempts} attempts.`;
                throw message;
            }

            if (!docking_feedback.includes("Success") && get_result_count >= 10) {

                robot_position = await getPosition();

                console.log(`Distance between robot and home coordinates: ${euclidean_dist(robot_position.slice(0, 2), home_position.slice(0, 2))}`);

                if (euclidean_dist(robot_position.slice(0, 2), home_position.slice(0, 2)) < 0.2) {
                    break;
                }

                docking("undock");
                attempts += 1;
                get_result_count = 0;

                console.log(`Undocking retry attempt: ${attempts}`);
            }

            console.log("Undocking...");
            await sleep(5000);
            get_result_count += 1;
            docking_feedback = await getDockingFeedback();
        }

        // reset counts
        get_result_count = 0;
        attempts = 0;

        // change to cleaning state 3
        if (await changeRobotState(3)) {
            console.log("Changing to Cleaning State...");
        } else {
            console.log("Robot is already in Cleaning State!");
        }

        // change map
        if (await changeMap(cleaning_plan)) {
            console.log(`Changing map to ${cleaning_plan}...`);
        } else {
            console.log(`Robot is already in ${cleaning_plan}!`);
        }

        await sleep(3000);

        // localise
        console.log("Localising...");
        let localise_response;
        try {
            localise_response = await localise();

            if (!localise_response) {
                message = "The robot may not be localised, please check RViz/WebViz to confirm.";
                throw message;
            }
        } catch (error) {
            console.log(error);
        }

        await sleep(5000);

        // starts cleaning_plan
        let cleaning_response = await cleaning(cleaning_plan, cleaning_zones);
        let goal_queue_size = await getGoalQueueSize();
        await sleep(10000);

        // checks if cleaning plan fails or if related nodes are dead
        if (!cleaning_response || goal_queue_size == 0) {
            message = "Cleaning plan has failed, please check and restart goal_manager or goal_owner accordingly. ";
            throw message;
        }

        console.log("Started cleaning plan.");

        // checks goal_queue_size every 5s
        while (goal_queue_size != 0) {
            console.log("Cleaning...")
            await sleep(5000);
            goal_queue_size = await getGoalQueueSize();
        }

        // navigate to home position
        await navigate(home_position);

        // checks goal queue when robot is navigating to home position
        // sends the goal to home zone again if goal is cancelled before reaching home
        while (euclidean_dist(robot_position.slice(0, 2), home_position.slice(0, 2)) >= 0.2) {
            if (attempts >= 3) {
                message = `Failed to navigate to home zone after ${attempts} attempts.`;
                throw message;
            }

            if (!goal_queue_size && get_result_count >= 5) {
                // add home position to end of cleaning plan again if cancelled 
                publishGoal(home_position);
                await manageGoals(0, "");
                attempts += 1;
                get_result_count = 0;

                console.log(`Navigating to home zone retry attempt: ${attempts}`);
            }

            console.log("Navigating to home position...");
            await sleep(5000);
            get_result_count += 1;
            robot_position = await getPosition();
        }

        // reset counts
        get_result_count = 0;
        attempts = 0;

        docking_feedback = await getDockingFeedback();

        // dock
        docking("dock");

        // checks if docking is successful, attempts the dock up to 3 times before failing
        while (!docking_feedback.includes("Success")) {
            if (attempts >= 3) {
                message = `Failed to dock after ${attempts} attempts.`;
                throw message;
            }

            if (!docking_feedback.includes("Success") && get_result_count >= 10) {
                docking("dock");
                attempts += 1;
                get_result_count = 0;

                console.log(`Docking retry attempt: ${attempts}`);
            }

            console.log("Docking...");
            await sleep(5000);
            get_result_count += 1;
            docking_feedback = await getDockingFeedback();
        }

        console.log("Done.");

    } catch (error) {
        console.log(`${error}. Please run the rest of the schedule manually.`);
    }
}

module.exports = cleaningProcess;