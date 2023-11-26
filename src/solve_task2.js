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
 * @param {String} filePath - Path to the JSON file
 */
async function updateExpiryDateByItemId(itemId, expiryDate, filePath) {
  const validatedItemId = Number(itemId);

  if (itemId === null || isNaN(validatedItemId) || !Number.isInteger(validatedItemId)) {
    throw new Error(validationErrorMessages.itemIdValidation);
  }

  const validDatedExpiryDate = new Date(expiryDate);

  if (expiryDate === null || isNaN(validDatedExpiryDate.getTime())) {
    throw new Error(validationErrorMessages.expiryDateValidation);
  }

  const readFileAsync = util.promisify(fs.readFile);
  const writeFileAsync = util.promisify(fs.writeFile);

  const data = await readFileAsync(filePath, "utf8");
  const productList = data ? JSON.parse(data) : undefined;

  if (!productList || !productList.products || !Array.isArray(productList.products)) {
    throw new Error("Invalid product data format.");
  }

  let itemFound = false;
  let productFound = {};

  for (let productIndex = 0; productIndex < productList.products.length; productIndex++) {
    const product = productList.products[productIndex];
    const itemIndex = product.items.findIndex(element => element.item_id === validatedItemId);

    if (itemIndex !== -1) {
      itemFound = true;
      productList.products[productIndex].items[itemIndex].expiry_date = expiryDate;   
      productFound = productList.products[productIndex];
      productFound.items = [productList.products[productIndex].items[itemIndex]];
      break;
    }
  }

  if (!itemFound) {
    throw new Error("Item with the given itemId not found.");
  }

  await writeFileAsync(filePath, JSON.stringify(productList, null, 2), "utf8");

  return productFound;
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
    console.log(JSON.stringify(product, null, 3));
  } catch (err) {
    console.error(err.message);
  }
})();

module.exports = {
  updateExpiryDateByItemId,
};
