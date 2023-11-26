const { addItem } = require("../src/task3");
const { validationErrorMessages } = require("../src/constants");

jest.restoreAllMocks();

// Test the function that uses fs.readFile
describe("Task 3: addItem", () => {
  
  // product exist or not
  test("should throw error if product does not exist", async () => {
    const item = { id: 101, expiry_date: "2060-05-15T10:57:07.846Z" };
    await expect(addItem(1000, item)).rejects.toThrow(
      validationErrorMessages.productNotFound
    );
  });

  // validate item criteria
  test("should return throw error when adding a new item with an already existing item id", async () => {
    const item = { id: 101, expiry_date: "2060-05-15T10:57:07.846Z" };
    await expect(addItem(1, item)).rejects.toThrow(
      validationErrorMessages.itemAlreadyExists
    );
  });

  test("should return throw error when adding a new item with an expired date", async () => {
    const item = { id: 107, expiry_date: "2005-01-17T10:42:56.976Z" };
    await expect(addItem(1, item)).rejects.toThrow(
      validationErrorMessages.itemExpired
    );
  });

  // check if updated product objects are returned or not
  test("should return updated product 1 object when added an item, with new item detail and increased 'items_left' count", async () => {
    const item = { id: 106, expiry_date: "2050-09-15T11:57:45.846Z" };
    const expectedProductObject = {
      id: 1,
      name: "Bimbo Breads",
      is_available: true,
      price: 12,
      rating: 4.69,
      brand: "Bimbo",
      category: "Bakery",
      items_left: 6,
      items: [
        {
          item_id: 101,
          expiry_date: "2050-03-30T12:57:07.846Z",
        },
        {
          item_id: 102,
          expiry_date: "2050-03-12T11:30:07.846Z",
        },
        {
          item_id: 103,
          expiry_date: "2023-03-07T06:32:07.846Z",
        },
        {
          item_id: 104,
          expiry_date: "2023-03-15T07:25:07.846Z",
        },
        {
          item_id: 105,
          expiry_date: "2050-02-01T12:57:07.846Z",
        },
        {
          item_id: 106,
          expiry_date: "2050-09-15T11:57:45.846Z",
        },
      ],
    };

    const result = await addItem(1, item);
    expect(result).toMatchObject(expectedProductObject);
  });
});