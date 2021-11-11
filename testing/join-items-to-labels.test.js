const joinItemsToLabels = require("../lib/join-items-to-labels");
const items = require("./data/items");
const labels = require("./data/labels");
const joinedItemsAndLabels = require("./result/joined-items-and-labels");

test("Join array of task objects to sites", async () => {
	expect(await joinItemsToLabels(items, labels)).toStrictEqual(
		joinedItemsAndLabels
	);
});
