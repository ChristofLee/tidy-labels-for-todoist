const dummyData = require("./data/dummy-data");
const expectedResult = require("./result/expected-result");
const formatLabels = require("../lib/format-labels");

test("Formatting labels should return a different object", async () => {
	expect(await formatLabels(dummyData)).toStrictEqual(expectedResult);
});
