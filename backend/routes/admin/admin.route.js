const express = require("express")
// const loginadmin = require("../../controllers/admin/Login")
const { addStaff, getAllStaffs,updateStaff, deleteStaff } = require("../../controllers/admin/staff")


const adminRouter = express.Router()


//routes
// adminRouter.post("/login-admin", loginadmin)

//creating staff
adminRouter.post("/register-staff", addStaff)
adminRouter.get("/get-all-staffs", getAllStaffs)
adminRouter.put("/update-staffs/:id", updateStaff);
adminRouter.delete("/delete-staff/:id", deleteStaff);

module.exports = adminRouter