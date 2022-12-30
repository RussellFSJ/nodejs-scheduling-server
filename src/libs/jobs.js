require("dotenv").config();
const scheduler = require("node-schedule");
const path = require("path");
const axios = require("axios");

let url = path.join(process.env.API_URL, "start_process");
let response = {};

// creates a cronjob that calls API endpoint(s) on robot to perform desired action(s)
const job = (crontab_expression, cleaning_plan) => {
    return scheduler.scheduleJob(crontab_expression, async () => {
        let request = { "api_key": process.env.API_KEY, "robot_name": process.env.ROBOT_NAME,
                        "process": cleaning_plan, "order": "combined" };
        try {
            response = await axios.post(url, request);
            console.log(response);
        }
        catch (error){
            console.log(error);
        }
    });
}

module.exports = job;