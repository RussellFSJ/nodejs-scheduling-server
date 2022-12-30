const express = require("express");
const router = express.Router();
const job = require("../libs/jobs");

// creates new schedule and adds it to schedules object
router.post("/", (req, res) => {
    let schedule = req.body;
    let schedule_id = req.body.schedule_id;
    let schedule_name = req.body.schedule_name;
    let crontab = req.body.crontab;
    let cleaning_plan_name = req.body.cleaning_plan_name;

    let success = false;
    let message = `Failed to create ${schedule_id}: ${schedule_name}.`;

    try {
        schedule["job"] = job(crontab, cleaning_plan_name);
        schedules[schedule_id] = schedule;

        success = true;
        message = `Successfully created ${schedule_id}: ${schedule_name}.`;
    }
    catch (error) {
        message += ` ${error}`;
    }

    res.json({ "success": success, "message": message });
});

// updates schedule in schedules object
router.put("/:id", (req, res) => {
    let id = req.params.id;
    let schedule_name = req.body.schedule_name;
    let crontab = req.body.crontab;
    let cleaning_plan_name = req.body.cleaning_plan_name;

    let success = false;
    let message = `Failed to update ${schedule_id}: ${schedule_name}.`;

    try {
        schedules[id]["schedule_name"] = schedule_name;
        schedules[id]["cleaning_plan_name"] = cleaning_plan_name;
        schedules[id]["crontab"] = crontab;
        schedules[id]["job"] = job(crontab, cleaning_plan_name);

        success = true;
        message = `Successfully updated ${schedule_id}: ${schedule_name}.`;
    }
    catch (error) {
        message += ` ${error}`;
    }

    res.json({ "success": success, "message": message });
});

// deletes schedule in schedules object
router.delete("/:id", (req, res) => {
    let id = req.params.id;

    let success = false;
    let message = `Failed to delete ${schedule_id}: ${schedule_name}.`;

    try {
        delete schedules[id];

        success = true;
        message = `Successfully deleted ${schedule_id}: ${schedule_name}.`;
    }
    catch (error) {
        message += ` ${error}`;
    }

    res.json({ "success": success, "message": message });
})

module.exports = router;
