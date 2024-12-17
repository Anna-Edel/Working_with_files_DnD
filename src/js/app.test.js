const { forTest } = require("./app");

test("should first", () => {
  expect(forTest()).toEqual(5);
});
