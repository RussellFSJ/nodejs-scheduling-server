const mongoose = require("mongoose");

// create schema and model

// mongoose casts query values based on type defined in schema
// while schema can be left empty, you should define fields used in queries
// https://stackoverflow.com/a/51860371/14372239
const SchedulesSchema = new mongoose.Schema({
    base_name: String
});

// optional 3rd argument to remove ambiguity of collection name in database
// https://stackoverflow.com/a/14183834/14372239
const Schedules = mongoose.model("schedules", SchedulesSchema, "schedules");

module.exports = Schedules;