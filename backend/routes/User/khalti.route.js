const express = require("express");
const { khalti } = require("../../controllers/User/khalti");

const khaltiRouter = express.Router();

khaltiRouter.route("/khalti/initiate").post(khalti)

module.exports = {khaltiRouter}