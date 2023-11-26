/**
 * Task 1
 */
const fs = require("fs");
const path = require("path");
const { validationErrorMessages } = require("./constants");

/**
 * Get Product info and its reviews
 * @param {Number} productId - Product id
 */
async function getProductInformationByProductId(productId, dataPaths) {

  try {
    if (productId <= 0) {
      throw new Error(validationErrorMessages.productIdValidation);
    }

    const productsData = JSON.parse(fs.readFileSync(dataPaths.productsPath, 'utf8')).products;
    const reviewsData = JSON.parse(fs.readFileSync(dataPaths.reviewsPath, 'utf8')).reviews;
    const customersData = JSON.parse(fs.readFileSync(dataPaths.customersPath, 'utf8')).customers;
    const imagesData = JSON.parse(fs.readFileSync(dataPaths.imagesPath, 'utf8')).images;

    const selectedProduct = productsData.find(productData => productData.id == productId);

    if ( !selectedProduct ) {
      throw new Error(validationErrorMessages.productNotFound);
    }

    return {
      id: selectedProduct.id,
      name: selectedProduct.name,
      reviews: [
        ...reviewsData.filter(
          reviewData => reviewData.product_id == productId
          ).map(selectedReview => {
            return {
              id: selectedReview.id,
              message: selectedReview.message,
              created_at: selectedReview.created_at,
              rating: selectedReview.rating,
              customer: {
                ...customersData.filter( customerData => customerData.id == selectedReview.customer_id).map(
                  customer => ({
                    id: customer.id,
                    name: customer.name,
                    email: customer.email,
                    phone_number: Buffer.from(String(customer.phone_number)).toString('base64')
                  }))[0]
              },
              images: [
                ...imagesData.filter(imageData => selectedReview.images.includes(imageData.id))
              ]
            };
          }).sort((prev, next) => new Date(next.created_at) - new Date(prev.created_at))
      ]
    };
  } catch (error) {
    console.log("Error:", error.message);
  }
  
}

/**
 * TIP: Use the following code to test your implementation
 */
(async () => {
  try {
    const productsPath = path.resolve(__dirname, "./data/task1/products.json");
    const reviewsPath = path.resolve(__dirname, "./data/task1/reviews.json");
    const customersPath = path.resolve(__dirname, "./data/task1/customers.json");
    const imagesPath = path.resolve(__dirname, "./data/task1/images.json");
    const dataPaths = {
      productsPath,
      reviewsPath,
      customersPath,
      imagesPath
    }
    const product = await getProductInformationByProductId(1, dataPaths);
    console.log(JSON.stringify(product, null, 3));
  } catch (err) {
    console.error(err);
  }
})();

module.exports = {
  getProductInformationByProductId,
};
