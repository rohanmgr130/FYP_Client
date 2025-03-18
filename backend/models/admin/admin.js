const mongoose = require("mongoose")

const adminSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
    minlength: [3, 'Full name must be at least 3 characters long'],
    maxlength: [100, 'Full name can be at most 100 characters long'],
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
  },
  contact: {
    type: String,
    required: true,
    match: [/^\d{10}$/, 'Contact number must be 10 digits'],
  },
  password: {
    type: String,
    required: true,
    minlength: [6, 'Password must be at least 6 characters long'],
  },
});

const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin