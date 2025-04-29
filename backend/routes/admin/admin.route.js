const express = require("express")
const { addStaff, getAllStaffs,updateStaff, deleteStaff } = require("../../controllers/admin/staff")


const staffRouter = express.Router()




//creating staff
staffRouter.post("/register-staff", addStaff)
staffRouter.get("/get-all-staffs", getAllStaffs)
staffRouter.put("/update-staffs/:id", updateStaff);
staffRouter.delete("/delete-staff/:id", deleteStaff);

module.exports = staffRouter