const changeMap = require("./changeMap");
const changeRobotState = require("./changeRobotState");
const cleaning = require("./cleaning");
const docking = require("./docking");
const getDockingResult = require("./getDockingResult");
const getDockingFeedback = require("./getDockingFeedback");
const getGoalQueueSize = require("./getGoalQueueSize");
const getPosition = require("./getPosition");
const localise = require("./localise");
const manageGoals = require("./manageGoals");
const navigate = require("./navigate");
const publishGoal = require("./publishGoal");

module.exports = { changeMap, changeRobotState, cleaning, docking, getDockingResult, getDockingFeedback, getGoalQueueSize, getPosition, localise, manageGoals, navigate, publishGoal };