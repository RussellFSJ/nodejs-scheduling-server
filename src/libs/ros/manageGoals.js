const path = require("path");
const axios = require("axios");

let url = path.join(process.env.API_URL, "manage_goals");
let response = {};
let success = false;

const manageGoals = async (exec_code, argument) => {
    let request = {
        "api_key": process.env.API_KEY, "robot_name": process.env.ROBOT_NAME,
        "exec_code": exec_code, "argument": argument
    };

    try {
        response = await axios.post(url, request);

        success = response.data.success;
    }
    catch (error) {
        console.log(error);
    }

    return success;
}

module.exports = manageGoals;       