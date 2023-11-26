/**
 * Task 3
 */
const fs = require("fs");
const path = require("path");
const moment = require("moment");
const { validationErrorMessages } = require("./constants");

/**
 * Add item to a product
 * @param {Number} productId - Product id
 * @param {Object} item - { id: 1010, expiry_date: "2050-03-30T12:57:07.846Z" }
 */
async function addItem(productId, item) {

  // Load product details from the provided JSON file
  const products = await JSON.parse(fs.readFileSync('./src/data/task3/products.json', 'utf8')).products;

  // Validate product ID
  if (!Number.isInteger(productId) || productId <= 0) {
    throw new Error(validationErrorMessages.productIdValidation);
  }

  // Validate item object
  if (
    !item ||
    typeof item !== 'object' ||
    !('id' in item) ||
    !('expiry_date' in item)
  ) {
    throw new Error(validationErrorMessages.itemValidation);
  }

  // Validate expiry date
  const expiryDate = new Date(item.expiry_date);
  if (expiryDate <= new Date()) {
    throw new Error(validationErrorMessages.itemExpired);
  }

  if (products) {
    // Find the product by ID
    const productIndex = products.findIndex((p) => p.id === productId);

    if (productIndex !== -1) {
      // Check if the item ID already exists in the product's items list
      const itemExists = products[productIndex].items.some(
        (existingItem) => existingItem.item_id === item.id
      );

      if (itemExists) {
        throw new Error(validationErrorMessages.itemAlreadyExists);
      }

      // Add the item to the product
      products[productIndex].items.push({
        item_id: item.id,
        expiry_date: item.expiry_date,
      });

      // Increment 'items_left' by 1
      products[productIndex].items_left += 1;

      // Sort items by 'item_id' in ascending order
      products[productIndex].items.sort((a, b) => a.item_id - b.item_id);

      return products[productIndex];
    } else {
      throw new Error(validationErrorMessages.productNotFound);
    }
  }
  
}

/**
 * TIP: Use the following code to test your implementation
 * Use different values for input parameters to test different scenarios
 */
(async () => {
  try {
    const result = await addItem(4, {
      id: 410,
      expiry_date: "2050-03-30T12:57:07.846Z",
    });
    console.log(result);
  } catch (err) {
    throw new Error(err.message);
    console.error(err);
  }
})();

module.exports = {
  addItem,
};
