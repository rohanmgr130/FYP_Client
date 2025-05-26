const mongoose = require("mongoose");

const promoCode = new mongoose.Schema({
  pcode:{
    type: String,
    required:true
  },
  tokenValue:{
    type:Number,
    required:true
  },
  discountPercentage:{
    type:Number,
    required:true
  },
  expiresAt:{
    type:Date,
    required:true
  },
  users:[
    {
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        default:null
    }
  ]
}, {
  timestamps: true
});

const PromoApply = mongoose.model("PromoApply", promoCode);

module.exports = PromoApply;
