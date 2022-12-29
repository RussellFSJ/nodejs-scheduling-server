require("dotenv").config();
const Schedules = require("../models/schedules");

// queries schedules from mongodb and returns a promise of the query
let query = { "base_name": process.env.ROBOT_NAME };
let projection = { "_id": 0, "cleaning_plan_name": 1, "schedule_name": 1, "crontab": 1 };

const getSchedules = () => {
    return Schedules.find(query, projection).exec();
}

module.exports = getSchedules;

