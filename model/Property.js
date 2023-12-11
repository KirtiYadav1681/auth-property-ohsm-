const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }, 
  propertyType: String,
  propertyName: String,
  phoneNumber: String,
  emailAddress: String,
  address: String,
  state: String,
  city: String,
  pincode: String,
  inventory: [
    {
      propertySpaceName: String,
      propertyInventoryType: String,
      otherPropertyInventoryType: String,
      capacity: Number,
      amenities: [String],
      availabilityStatus: String,
      notes: String,
    }
  ],
});

module.exports = mongoose.model('Property', propertySchema);
