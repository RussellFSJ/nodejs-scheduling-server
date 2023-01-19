const Schedules = require("../models/schedules");

// queries schedules from mongodb and returns a promise of the query
let query = { "base_name": process.env.ROBOT_NAME };
let projection = { "_id": 0, "schedule_id": 1, "cleaning_plan_name": 1, "cleaning_receipt": 1, "crontab": 1, "expiration_date": 1 };

const getSchedules = () => {
    return Schedules.find(query, projection).exec();
}

module.exports = getSchedules;

