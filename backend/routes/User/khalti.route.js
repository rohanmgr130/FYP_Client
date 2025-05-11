// const express = require("express");
// const { khalti } = require("../../controllers/User/khalti");

// const khaltiRouter = express.Router();

// khaltiRouter.route("/khalti/initiate").post(khalti)

// module.exports = {khaltiRouter}


const express = require("express");
const { khalti, verifyKhaltiPayment } = require("../../controllers/User/khalti");
const { authenticateUser } = require("../../middleware/authMiddleware");

const khaltiRouter = express.Router();

// Route to initiate Khalti payment
khaltiRouter.route("/khalti/initiate").post(khalti);

// Route to verify Khalti payment
khaltiRouter.route("/khalti/verify").post(verifyKhaltiPayment);

module.exports = { khaltiRouter };