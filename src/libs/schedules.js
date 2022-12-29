require("dotenv").config();
const scheduler = require('node-schedule');
const Schedules = require("../models/schedules");

// reads schedules from mongodb to create schedule jobs
let schedules = {};
let query = { "base_name": process.env.ROBOT_NAME };
let projection = { "_id": 0, "cleaning_plan_name": 1, "schedule_name": 1, "crontab": 1 };

// Schedules.find(query, projection).exec().then((data) => {
//     global.schedules = data;
// }).then(() => {
//     // console.log(global.schedules);
// });

const getSchedules = async () => {
    try {
        let response = await Schedules.find(query, projection);
        console.log(response[0]["cleaning_plan_name"])
        response.forEach(doc => {
            // schedules[doc[0]["schedule_name"]] = doc;
            // schedules[document["job"]] = scheduler.scheduleJob(document["crontab"], () => {
            //     console.log("hello");
            // });
            console.log(JSON.parse(JSON.stringify(doc))["cleaning_plan_name"]);
            // Object.keys(doc).forEach((key) => {
            //     console.log(doc[key])
            // })
        }
        );
    }
    catch (error) {
        console.log(error);
    }
}

getSchedules();

module.exports = schedules;

