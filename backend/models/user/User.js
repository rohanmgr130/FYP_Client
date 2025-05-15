const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema(
  { 
    fullname: {
      type: String,
      required: [true, "Please provide a full name"],
      minlength: [3, 'Full name must be at least 3 characters long'],
      maxlength: [100, 'Full name can be at most 100 characters long'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\S+@\S+\.\S+$/,
        "Please provide a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: [6, 'Password must be at least 6 characters long'],
    },
    contact: {
      type: String,
      required: [true, "Please provide a contact number"],
      match: [/^\d{10}$/, 'Contact number must be 10 digits'],
    },
    role: {
      type: String,
      enum: ["user", "admin", "staff"],
      default: "user",
    },
    staffType: {
      type: String,
      enum: ["chef", "waiter", "cashier", "manager", "cleaner", "bartender", "host", "kitchen_helper", "delivery"],
      required: function () {
        return this.role === "staff";
      }
    },    
    rewardPoints: {
      type: Number,
      default: 0,
      min: 0
    },
    address: {
      street: String,
      city: String,
      state: String,
      postalCode: String,
      country: String,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: String,
    verificationTokenExpires: Date,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  { timestamps: true }
);

// Hash password before saving
UserSchema.pre("save", async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified("password")) return next();
  try {
    // Generate salt
    const salt = await bcrypt.genSalt(10);
    // Hash password with salt
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method - for consistency, but we're not using this in the login controller
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to check if user is a specific staff type
UserSchema.methods.isStaffType = function(type) {
  return this.role === "staff" && this.staffType === type;
};

const User = mongoose.model("User", UserSchema);

module.exports = User;