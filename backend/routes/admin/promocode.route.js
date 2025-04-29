// routes/admin/promoCodeRoutes.js
const express = require('express');
const promocodeRoute = express.Router();
const promoCodeController = require('../../controllers/admin/Promocode');
const { authenticateUser, isAdmin } = require('../../middleware/authMiddleware');

// Apply admin authentication to all routes
promocodeRoute.use(authenticateUser, isAdmin);

// Create a single promo code
promocodeRoute.post('/create', promoCodeController.createPromoCode);

// Create bulk promo codes and send to users
promocodeRoute.post('/bulk-send', promoCodeController.bulkCreateAndSendPromoCodes);

// Generate bulk promo codes (without sending)
promocodeRoute.post('/generate-bulk', promoCodeController.generateBulkCodes);

// Get all promo codes
promocodeRoute.get('/get-all-code', promoCodeController.getAllPromoCodes);

// Get promo code by ID
promocodeRoute.get('/:id', promoCodeController.getPromoCodeById);

// Update promo code
promocodeRoute.put('/:id', promoCodeController.updatePromoCode);

// Delete promo code
promocodeRoute.delete('/:id', promoCodeController.deletePromoCode);

module.exports = promocodeRoute;