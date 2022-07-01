const mongoose = require("mongoose");
const Coupon = mongoose.model(
  "Coupon",
  new mongoose.Schema({
    offerName: String,
    couponCode: String,
    startDate: Date,
    endDate: Date,
    status: Number,
    discountPercentage: Number,
    discountAmount : Number,
    termsConditions: String,
    image: String,
  },
  { timestamps: { createdAt: 'created_at', updateAt: 'updated_at' } })
);
module.exports = Coupon;