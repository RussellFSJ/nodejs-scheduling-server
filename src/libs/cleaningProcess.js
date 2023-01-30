const { cleaning, docking, getDockingResult, getGoalQueueSize, getPosition,
    localise, manageGoals, navigate, publishGoal } = require("./ros");
const euclidean_dist = require("euclidean-distance");
const sleep = require("./sleep");

// needs refinement for checks 
const cleaningProcess = async (cleaning_plan, cleaning_zones) => {
    try {
        let message = "";
        let get_result_count = 0;
        let attempts = 0;

        let home_position = JSON.parse(process.env.HOME_ZONES)[cleaning_plan];
        let robot_position = await getPosition();

        let docking_result = await getDockingResult();

        // undock
        docking("undock");

        // checks if undocking is successful 
        while (!docking_result) {
            console.log("Undocking...");
            await sleep(1000);
            docking_result = await getDockingResult();
            get_result_count += 1;
            if (attempts >= 3) {
                message += `Failed to undock after ${attempts} attempts.`;
                throw message;
            }

            if (!docking_result && get_result_count >= 10) {
                docking("undock");
                attempts += 1;
                get_result_count = 0;

                console.log(`Undocking retry attempt: ${attempts}`);
            }
        }

        // localise
        console.log("Localising...");
        localise();

        await sleep(10000);

        // starts cleaning_plan
        await cleaning(cleaning_plan, cleaning_zones);
        await sleep(10000);
        console.log("Started cleaning plan.")

        // checks goal_queue_size every 30s
        while (await getGoalQueueSize() != 0) {
            console.log("Cleaning...")
            await sleep(5000);
        }

        // navigate to home position
        await navigate(home_position);

        // checks goal queue when robot is navigating to home position
        // sends the goal to home zone again if goal is cancelled before reaching home
        while (euclidean_dist(robot_position.slice(0, 2), home_position.slice(0, 2)) >= 0.2) {
            console.log("Navigating to home position...");

            // navigate to home position
            // await navigate(home_position);

            if (await getGoalQueueSize() == 0) {
                // add home position to end of cleaning plan again if cancelled 
                publishGoal(home_position);
                await manageGoals(0, "");
            }

            await sleep(5000);
            robot_position = await getPosition();
        }

        docking_result = await getDockingResult();

        // dock
        docking("dock");

        // checks if docking is successful 
        while (!docking_result) {
            console.log("Docking...");
            await sleep(1000);
            docking_result = await getDockingResult();
        }

        console.log("Done.");

    }
    catch (error) {
        message += error;
        console.log(message);
    }
}

module.exports = cleaningProcess;