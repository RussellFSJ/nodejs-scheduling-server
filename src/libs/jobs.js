require("dotenv").config();
const scheduler = require("node-schedule");
const path = require("path");
const Schedules = require("../models/schedules");
const axios = require("axios");

let url = path.join(process.env.API_URL, "start_process");
let response = {};

// creates a cronjob that calls API endpoint(s) on robot to perform desired action(s)
const job = (schedule_id, crontab_expression, cleaning_plan, expiration_date) => {
    return scheduler.scheduleJob(crontab_expression, async () => {
        let present = new Date();
        let expiry = new Date(expiration_date);

        // checks if schedule has expired and deletes the cronjob in this server and document in MongoDB
        if ((expiry - present) < 0) {
            schedules[schedule_id]["job"].cancel();
            delete schedules[schedule_id];
            try {
                await Schedules.deleteOne({ "schedule_id": schedule_id });
            }
            catch (error) {
                console.log(`Failed to delete document from MongoDB. ${error}`);
            }
        }
        else {
            let request = {
                "api_key": process.env.API_KEY, "robot_name": process.env.ROBOT_NAME,
                "process": cleaning_plan, "order": "combined"
            };

            try {
                response = await axios.post(url, request);
                console.log(response);
            }
            catch (error) {
                console.log(error);
            }
        }
    });
}

module.exports = job;