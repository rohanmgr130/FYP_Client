// models/PromoCode.js
const mongoose = require('mongoose');

const PromoCodeSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        uppercase: true
    },
    discountType: {
        type: String,
        enum: ['percentage', 'fixed'],
        required: true
    },
    discountValue: {
        type: Number,
        required: true,
        min: 1
    },
    expiryDate: {
        type: Date,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isUsed: {
        type: Boolean,
        default: false
    },
    usedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    usedAt: {
        type: Date,
        default: null
    },
    minOrderValue: {
        type: Number,
        default: 0
    },
    maxDiscountAmount: {
        type: Number,
        default: null
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

const PromoCode = mongoose.model('PromoCode', PromoCodeSchema);
module.exports = PromoCode;