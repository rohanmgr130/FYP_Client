const express = require("express")
const { addStaff, getAllStaffs,updateStaff, deleteStaff } = require("../../controllers/admin/staff")


const adminRouter = express.Router()




//creating staff
adminRouter.post("/register-staff", addStaff)
adminRouter.get("/get-all-staffs", getAllStaffs)
adminRouter.put("/update-staffs/:id", updateStaff);
adminRouter.delete("/delete-staff/:id", deleteStaff);

module.exports = adminRouter