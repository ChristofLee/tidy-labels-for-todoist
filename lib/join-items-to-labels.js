module.exports = async function joinItemsToLabels(items, labels) {
	items.map((item) => {
		item.labels.forEach((el) => {
			var label = labels.findIndex((obj) => {
				return obj.name === el;
			});
			labels[label].hasTasks = 1;
		});
	});

	return labels;
};
