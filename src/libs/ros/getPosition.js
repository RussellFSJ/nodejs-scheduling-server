const path = require("path");
const axios = require("axios");

let url = path.join(process.env.API_URL, "position");
let response = {};
let position = [];

const getPosition = async () => {
    let request = {
        "api_key": process.env.API_KEY, "robot_name": process.env.ROBOT_NAME,
    };

    try {
        response = await axios.post(url, request);

        position = response.data.result.pose2d;
    }
    catch (error) {
        console.log(error);
    }

    return position;
}

module.exports = getPosition;