const cleaning = require("./cleaning");
const docking = require("./docking");
const getDockingResult = require("./getDockingResult");
const getGoalQueueSize = require("./getGoalQueueSize");
const getPosition = require("./getPosition");
const localise = require("./localise");
const manageGoals = require("./manageGoals");
const navigate = require("./navigate");
const publishGoal = require("./publishGoal");

module.exports = { cleaning, docking, getDockingResult, getGoalQueueSize, getPosition, localise, manageGoals, navigate, publishGoal };