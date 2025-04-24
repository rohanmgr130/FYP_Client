// const mongoose = require('mongoose');

// const CartSchema = new mongoose.Schema({
//     userId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User',
//         required: true
//     },
//     items: [
//         {
//             productId: {
//                 type: mongoose.Schema.Types.ObjectId,
//                 ref: 'Menu',
//                 required: true
//             },
//             productQuantity: {
//                 type: Number,
//                 required: true,
//                 min: 1
//             },
//             price: {
//                 type: Number,
//                 required: true
//             },
//             total: {
//                 type: Number,
//                 required: true
//             },
//             isPlacedOrder: {
//                 type: Boolean,
//                 required: true,
//                 default: false
//             }
//         }
//     ],
//     orderTotal: {
//         type: Number,
//         default: 0
//     },
//     promoCode: {
//         type: String,
//         default: null
//     },
//     discount: {
//         type: Number,
//         default: 0
//     },
//     finalTotal: {
//         type: Number,
//         default: 0
//     }
// }, { 
//     timestamps: true
//  });

// // Middleware to calculate total cost
// CartSchema.pre('save', function (next) {
//     // Calculate order total from items
//     this.orderTotal = this.items.reduce((sum, item) => sum + item.total, 0);
    
//     // Ensure discount doesn't exceed order total
//     if (this.discount > this.orderTotal) {
//         this.discount = this.orderTotal;
//     }
    
//     // Calculate final total
//     this.finalTotal = this.orderTotal - this.discount;
    
//     next();
// });

// const Cart = mongoose.model('Cart', CartSchema);

// module.exports = Cart;


const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Menu',
                required: true
            },
            productQuantity: {
                type: Number,
                required: true,
                min: 1
            },
            price: {
                type: Number,
                required: true
            },
            total: {
                type: Number,
                required: true
            },
            isPlacedOrder: {
                type: Boolean,
                required: true,
                default: false
            }
        }
    ],
    orderTotal: {
        type: Number,
        default: 0
    },
    promoCode: {
        type: String,
        default: null
    },
    discount: {
        type: Number,
        default: 0
    },
    finalTotal: {
        type: Number,
        default: 0
    }
}, { 
    timestamps: true
});

// Middleware to calculate total cost
CartSchema.pre('save', function (next) {
    // Calculate order total from items
    this.orderTotal = this.items.reduce((sum, item) => sum + item.total, 0);
    
    // Ensure discount doesn't exceed order total
    if (this.discount > this.orderTotal) {
        this.discount = this.orderTotal;
    }
    
    // Calculate final total
    this.finalTotal = this.orderTotal - this.discount;
    
    next();
});

const Cart = mongoose.model('Cart', CartSchema);

module.exports = Cart;