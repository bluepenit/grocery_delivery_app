const { getProductInformationByProductId } = require("../src/task1");
const path = require("path");
const productsPath = path.resolve(__dirname, "../src/data/task1/products.json");
const reviewsPath = path.resolve(__dirname, "../src/data/task1/reviews.json");
const customersPath = path.resolve(__dirname, "../src/data/task1/customers.json");
const imagesPath = path.resolve(__dirname, "../src/data/task1/images.json");

const dataPaths = {
  productsPath,
  customersPath,
  reviewsPath,
  imagesPath
}

describe("Task 1: getProductInformation", () => {
  let result = null;

  beforeAll(async () => {
    result = await getProductInformationByProductId(1, dataPaths);
  });

  test("should include images in the review object for product id 1", () => {
    expect(result.reviews[0].images[0].id).toBe(2);
    expect(result.reviews[0].images[0].url).toBe(
      "https://farm4.staticflickr.com/3752/9684880330_9b4698f7cb_z_d.jpg"
    );
  });

  test("should exclude credit card numbers for product id 1", () => {
    expect(result.reviews[0].customer.credit_card).not.toBeDefined();
  });

  test("should include formatted customer object in the review object for product id 1", async () => {
    expect(result.reviews[0].customer.id).toBe(2);
    expect(result.reviews[0].customer.name).toBe("Hemanth");
    expect(result.reviews[0].customer.email).toBe("hemanth.p@gmail.com");
    expect(result.reviews[0].customer.phone_number).toBe("NDA1Njc3NDAyMw==");
  });
});
