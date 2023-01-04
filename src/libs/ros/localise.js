const path = require("path");
const axios = require("axios");

let url = path.join(process.env.API_URL, "localise");
let response = {};
let success = false;

const localise = async () => {
    let request = {
        "api_key": process.env.API_KEY, "robot_name": process.env.ROBOT_NAME
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

module.exports = localise;       