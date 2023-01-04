const path = require("path");
const axios = require("axios");

let url = path.join(process.env.API_URL, "docking");
let response = {};
let success = false;

const docking = async (action) => {
    let request = {
        "api_key": process.env.API_KEY, "robot_name": process.env.ROBOT_NAME,
        "action": action
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

module.exports = docking;