const { updateExpiryDateByItemId } = require("../src/task2");
const { validationErrorMessages } = require("../src/constants");
const path = require('path');

const filePath = path.resolve(__dirname, "../src/data/task2/update_item_products.json");

describe("Task 2: updateExpiryDateByItemId", () => {
  test("should not throw compile time error", async () => {
    await expect(
      updateExpiryDateByItemId(132, "2050-01-01", filePath)
    ).resolves.not.toThrow(ReferenceError);
  });

  test("should return the updated expiry_date of the item with the provided item_id for item 132", async () => {
    const itemId = 132;
    const expiryDate = "2050-12-31";

    const product = await updateExpiryDateByItemId(itemId, expiryDate, filePath);

    expect(product.id).toBe(5);
    expect(product.items.length).toBe(1);
    expect(product.items[0].item_id).toBe(itemId);
    expect(product.items[0].expiry_date).toBe(expiryDate);
  });

  test("should throw an error if the item id is not found", async () => {
    await expect(
      updateExpiryDateByItemId(5693, "2050-12-31")
    ).rejects.not.toThrow(ReferenceError);

    await expect(updateExpiryDateByItemId(5693, "2050-12-31", filePath)).rejects.toThrow(
      validationErrorMessages.itemNotFound
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
