const PromoApply = require('../../models/staff/promoCode.js')
const User = require("../../models/user/User.js")



const createPromoCode = async (req, res) => {
  try {
    const { pcode, tokenValue, discountPercentage, expiresAt } = req.body;

    // Validate required fields
    if (!pcode || !tokenValue || !discountPercentage) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check for duplicate promo code
    const existingPromo = await PromoApply.findOne({ pcode });
    if (existingPromo) {
      return res.status(409).json({ message: "Promo code already exists" });
    }

    // Create new promo code
    const newPromo = new PromoApply({
      pcode,
      tokenValue,
      discountPercentage,
      expiresAt
    });

    await newPromo.save();

    res.status(201).json({
      message: "Promo code created successfully",
      promoCode: newPromo,
    });
  } catch (error) {
    console.error("Error creating promo code:", error);
    res.status(500).json({ message: "Server error" });
  }
};


//for getting all promos
const getValidPromoCodes = async (req, res) => {
  try {
    const today = new Date();

    const validPromos = await PromoApply.find({
      expiresAt: { $gt: today }
    });

    res.status(200).json({success:true, message:"Promo Code Fetched", data:validPromos});
  } catch (error) {
    console.error("Error fetching valid promo codes:", error);
    res.status(500).json({ message: "Server error while retrieving promo codes" });
  }
};


//for redeem code 
const redeemPromoCode = async (req, res) => {
  try {
    const { userId } = req.params;
    const { pcode } = req.body; //promo code id 

    if (!pcode) {
      return res.status(400).json({success:false, message: "Promo code is required" });
    }
    if(!userId){
      return res.status(400).json({success:false, message: "User Id is required" });
    }

    const user = await User.findById(userId)

    if (!user) {
      return res.status(404).json({success:false, message: "User not found" });
    }

    const promo = await PromoApply.findById(pcode)

    if (!promo) {
      return res.status(404).json({success:false, message: "Promo code not found" });
    }

    const currentDate = new Date();
    if (promo.expiresAt < currentDate) {
      return res.status(400).json({success:false, message: "Promo code has expired" });
    }

    if (promo.users.includes(userId)) {
      return res.status(409).json({success:false, message: "Promo code already used by this user" });
    }


    const userPoints = user.rewardPoints

    if (userPoints < promo.tokenValue){
        return res.stats(400).json({success:false, message:"Insufficient reward point"})
    }

    user.rewardPoints = user.rewardPoints - promo.tokenValue
    
    await user.save()

    // Append userId to users array
    promo.users.push(userId);
    await promo.save();

    res.status(200).json({success:true,
      message: "Promo code redeemed successfully",
      discountPercentage: promo.discountPercentage,
      tokenValue: promo.tokenValue,
    });
  } catch (error) {
    console.error("Error redeeming promo code:", error);
    res.status(500).json({success:false, message: "Server error during promo redemption" });
  }
};


//for getting personal reedemed promos

const getUserRedeemedPromos = async (req, res) => {
  try {
    const { userId } = req.params;

    const redeemedPromos = await PromoApply.find({
      users: userId, // Mongoose automatically checks ObjectId match
    });

    res.status(200).json({
        success:true,
        message:"Promo Fetched successfully",
        data:redeemedPromos
    });
  } catch (error) {
    console.error("Error fetching user's redeemed promos:", error);
    res.status(500).json({ message: "Server error while retrieving redeemed promo codes" });
  }
};




module.exports = {
  createPromoCode, //stff
  getValidPromoCodes, //staff
  redeemPromoCode, //user
  getUserRedeemedPromos //user
};