// controllers/admin/Promocode.js

const PromoCode = require('../../models/admin/promocode');
const User = require('../../models/user/User');
const nodemailer = require('nodemailer');

// Uncomment this if you want email sending
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Generate a unique promo code
const generateUniqueCode = async (prefix = '') => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code;
    let isUnique = false;
    
    while (!isUnique) {
        code = prefix;
        for (let i = 0; i < 6; i++) {
            code += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        const existingCode = await PromoCode.findOne({ code });
        if (!existingCode) {
            isUnique = true;
        }
    }
    return code;
};

// Create a single promo code
const createPromoCode = async (req, res) => {
    try {
        const { code, discountType, discountValue, expiryDate, prefix, minOrderValue, maxDiscountAmount } = req.body;
        const promoCode = code ? code.toUpperCase() : await generateUniqueCode(prefix || '');
        
        const existingCode = await PromoCode.findOne({ code: promoCode });
        if (existingCode) {
            return res.status(400).json({ success: false, message: 'Promo code already exists' });
        }
        
        const newPromoCode = new PromoCode({
            code: promoCode,
            discountType,
            discountValue,
            expiryDate: new Date(expiryDate),
            minOrderValue: minOrderValue || 0,
            maxDiscountAmount: maxDiscountAmount || null,
            createdBy: req?.user?._id || null
        });

        await newPromoCode.save();

        res.status(201).json({ success: true, message: 'Promo code created successfully', promoCode: newPromoCode });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to create promo code', error: error.message });
    }
};

// Bulk create and (optionally) send promo codes
const bulkCreateAndSendPromoCodes = async (req, res) => {
    try {
        const { userIds, discountType, discountValue, expiryDate, prefix, minOrderValue, maxDiscountAmount } = req.body;
        
        const createdCodes = [];
        const failedEmails = [];
        const users = await User.find({ _id: { $in: userIds } });

        for (const user of users) {
            try {
                const code = await generateUniqueCode(prefix || '');
                const promoCode = new PromoCode({
                    code,
                    discountType,
                    discountValue,
                    expiryDate: new Date(expiryDate),
                    minOrderValue: minOrderValue || 0,
                    maxDiscountAmount: maxDiscountAmount || null,
                    createdBy: req?.user?._id || null
                });
                
                await promoCode.save();
                createdCodes.push(promoCode);

                // If you want email sending, uncomment below
                
                const emailContent = `
                    <h1>Special Offer Just For You!</h1>
                    <p>Hello ${user.name}, your exclusive promo code is: <b>${code}</b></p>
                    <p>Valid until: ${new Date(expiryDate).toLocaleDateString()}</p>
                `;
                await transporter.sendMail({
                    from: process.env.EMAIL_FROM,
                    to: user.email,
                    subject: 'Your Exclusive Promo Code!',
                    html: emailContent
                });
                
            } catch (error) {
                console.error(`Failed for user ${user.email}:`, error);
                failedEmails.push(user.email);
            }
        }

        res.status(200).json({
            success: true,
            message: `Created and handled ${createdCodes.length} promo codes`,
            failedEmails
        });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Bulk creation failed', error: error.message });
    }
};

// Generate bulk codes (only create, no sending)
const generateBulkCodes = async (req, res) => {
    try {
        const { count, prefix, discountType, discountValue, expiryDate, minOrderValue, maxDiscountAmount } = req.body;

        if (!count || count < 1 || count > 100) {
            return res.status(400).json({ success: false, message: 'Count must be between 1 and 100' });
        }

        const generatedCodes = [];

        for (let i = 0; i < count; i++) {
            const code = await generateUniqueCode(prefix || '');
            const promoCode = new PromoCode({
                code,
                discountType,
                discountValue,
                expiryDate: new Date(expiryDate),
                minOrderValue: minOrderValue || 0,
                maxDiscountAmount: maxDiscountAmount || null,
                createdBy: req?.user?._id || null
            });
            await promoCode.save();
            generatedCodes.push(code);
        }

        res.status(201).json({ success: true, message: `Generated ${count} promo codes`, promoCodes: generatedCodes });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to generate promo codes', error: error.message });
    }
};

// Get all promo codes with filter
const getAllPromoCodes = async (req, res) => {
    try {
        const { isUsed, expiryBefore, expiryAfter, discountType, page = 1, limit = 10 } = req.query;
        const filter = {};

        if (isUsed !== undefined) filter.isUsed = isUsed === 'true';
        if (expiryBefore) filter.expiryDate = { ...filter.expiryDate, $lte: new Date(expiryBefore) };
        if (expiryAfter) filter.expiryDate = { ...filter.expiryDate, $gte: new Date(expiryAfter) };
        if (discountType) filter.discountType = discountType;

        const total = await PromoCode.countDocuments(filter);
        const promoCodes = await PromoCode.find(filter)
            .populate('usedBy', 'name email')
            .populate('createdBy', 'name')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(Number(limit));

        res.status(200).json({
            success: true,
            count: promoCodes.length,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: Number(page),
            promoCodes
        });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch promo codes', error: error.message });
    }
};

// Get promo code by ID
const getPromoCodeById = async (req, res) => {
    try {
        const promoCode = await PromoCode.findById(req.params.id)
            .populate('usedBy', 'name email')
            .populate('createdBy', 'name');

        if (!promoCode) {
            return res.status(404).json({ success: false, message: 'Promo code not found' });
        }

        res.status(200).json({ success: true, promoCode });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch promo code', error: error.message });
    }
};

// Update promo code
const updatePromoCode = async (req, res) => {
    try {
        const { isActive, expiryDate, minOrderValue, maxDiscountAmount } = req.body;
        const promoCode = await PromoCode.findById(req.params.id);

        if (!promoCode) {
            return res.status(404).json({ success: false, message: 'Promo code not found' });
        }

        if (isActive !== undefined) promoCode.isActive = isActive;
        if (expiryDate) promoCode.expiryDate = new Date(expiryDate);
        if (minOrderValue !== undefined) promoCode.minOrderValue = minOrderValue;
        if (maxDiscountAmount !== undefined) promoCode.maxDiscountAmount = maxDiscountAmount;

        await promoCode.save();

        res.status(200).json({ success: true, message: 'Promo code updated', promoCode });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to update promo code', error: error.message });
    }
};

// Delete promo code
const deletePromoCode = async (req, res) => {
    try {
        const promoCode = await PromoCode.findById(req.params.id);

        if (!promoCode) {
            return res.status(404).json({ success: false, message: 'Promo code not found' });
        }

        if (promoCode.isUsed) {
            return res.status(400).json({ success: false, message: 'Cannot delete a used promo code' });
        }

        await PromoCode.findByIdAndDelete(req.params.id);

        res.status(200).json({ success: true, message: 'Promo code deleted successfully' });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to delete promo code', error: error.message });
    }
};

// New functions (fixed)
const applyPromoCode = async (req, res) => {
    try {
        const { promoCode } = req.body;
        const foundPromo = await PromoCode.findOne({ code: promoCode });

        if (!foundPromo) {
            return res.status(404).json({ error: "Promo code not found or expired." });
        }

        res.status(200).json({
            message: "Promo code applied successfully!",
            discountType: foundPromo.discountType,
            discountValue: foundPromo.discountValue,
            minOrderValue: foundPromo.minOrderValue,
            maxDiscountAmount: foundPromo.maxDiscountAmount,
            expiryDate: foundPromo.expiryDate
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to apply promo code" });
    }
};

const removePromoCode = async (req, res) => {
    try {
        const { promoCode } = req.body;
        const deletedPromo = await PromoCode.findOneAndDelete({ code: promoCode });

        if (!deletedPromo) {
            return res.status(404).json({ error: "Promo code not found." });
        }

        res.status(200).json({ message: "Promo code removed successfully." });
    } catch (error) {
        res.status(500).json({ error: "Failed to remove promo code" });
    }
};

const getAvailablePromoCodes = async (req, res) => {
    try {
        const promoCodes = await PromoCode.find({});
        res.status(200).json({ promoCodes });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch promo codes" });
    }
};

module.exports = {
    createPromoCode,
    bulkCreateAndSendPromoCodes,
    generateBulkCodes,
    getAllPromoCodes,
    getPromoCodeById,
    updatePromoCode,
    deletePromoCode,
    applyPromoCode,
    removePromoCode,
    getAvailablePromoCodes
};
