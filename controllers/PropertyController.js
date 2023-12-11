const Property = require('../model/Property');

module.exports.addPropertyWithInventory = async (req, res) => {
  try {
    // Extracting user from the request sent by the middleware
    const user = req.user;

    // Extracting property and inventory details from the request body
    const { propertyType, propertyName, phoneNumber, emailAddress, address, state, city, pincode, inventoryDetails } = req.body;

    // Creating a new property with the provided details from request's body
    const property = new Property({
      user: user._id,
      propertyType,
      propertyName,
      phoneNumber,
      emailAddress,
      address,
      state,
      city,
      pincode,
      inventory: inventoryDetails, // Assuming inventoryDetails is an array of inventory details
    });

    // Saving the property to the database
    await property.save();
    
    return res.status(201).send({ message: 'Property with Inventory created successfully.', property });
  } catch (error) {
    return res.status(500).send({ message: 'Internal Server Error in creating a property with inventory',error });
  }
};
