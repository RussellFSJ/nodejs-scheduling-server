const scheduler = require("node-schedule");
const Schedules = require("../models/schedules");
const cleaningProcess = require("./cleaningProcess");

// creates a cronjob that calls API endpoint(s) on robot to perform desired action(s)
const createJob = (schedule_id, crontab_expression, cleaning_plan, cleaning_zones, expiration_date) => {
    return scheduler.scheduleJob(crontab_expression, async () => {
        let present = new Date();
        let expiry = new Date(expiration_date);

        // checks if schedule has expired and deletes the cronjob in this server and document in MongoDB
        if ((expiry - present) < 0) {
            schedules[schedule_id]["job"].cancel();
            delete schedules[schedule_id];

            // to be discussed: how to delete expired entry to align with the ui 
            // try {
            //     await Schedules.deleteOne({ "schedule_id": schedule_id });
            // }
            // catch (error) {
            //     console.log(`Failed to delete document from MongoDB. ${error}`);
            // }
        }
        else {
            try {
                cleaningProcess(cleaning_plan, cleaning_zones);
            }
            catch (error) {
                console.log(`Failed to execute/complete cleaning process. ${error}`)
            }
        }
    });
}

module.exports = createJob;