/**
 * Task 2
 */

const fs = require("fs");
const path = require("path");
const util = require("util");
const { validationErrorMessages } = require("./constants");

/**
 * Update expiry date of the item
 * @param {Number} itemId - Item id
 * @param {String} expiryDate - Expiry date in ISO8601 format
 */
async function updateExpiryDateByItemId(itemId, expiryDate, filePath) {

    try {
      if (!Number.isInteger(itemId) || itemId <= 0) {
        throw new Error(validationErrorMessages.itemIdValidtion);
      }
      
      const data = fs.readFileSync(filePath);
      const { products } = JSON.parse(data);

      // Find the product with the given itemId
      const product = products.find(p => p.items.some(item => item.item_id == itemId));
  
  
      // If product is not found, throw an error
      if (!product) {
        throw new Error(validationErrorMessages.itemNotFound);
    }
      // Update the expiry date for the matching item
      const updatedItem = product.items.find(item => item.item_id === itemId);

      updatedItem.expiry_date = expiryDate;
  
      // Return the updated product
      return {
        ...product,
        items: [
          {
            ...updatedItem
          }
        ]
      };
      
    } catch (error) {
      throw new Error(validationErrorMessages.itemNotFound);
      // console.log(error.message);
    }
}

/**
 * TIP: Use the following code to test your implementation.
 * You can change the itemId and expiryDate that is passed to
 * the function to test different use cases/scenarios
 */
(async () => {
  try {
    const filePath = path.resolve(__dirname, "./data/task2/update_item_products.json");
    const product = await updateExpiryDateByItemId(142, "2022-01-01", filePath);
    // console.log(JSON.stringify(product, null, 3));
  } catch (err) {
    console.error(err);
  }
})();

module.exports = {
  updateExpiryDateByItemId,
};
