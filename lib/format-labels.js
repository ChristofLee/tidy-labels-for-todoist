const color = require("./color");

module.exports = async function formatLabels(labels) {
	let formattedLabels = [];
	let i = color.first;

	if (labels.length > 0) {
		labels.sort(compare); // Sort by name, ASC.

		for (let j = 0; j < labels.length; j++) {
			// Format name of the label.
			let name = labels[j].name;
			name = name.toLowerCase(); // Make the name of the label lowercase
			name = name.replace(" ", "_"); // Replace spaces with underscores.

			let newLabel = {
				color: i,
				id: labels[j].id,
				item_order: j,
				name: name,
			};

			if (!("hasTasks" in labels[j])) {
				newLabel.item_order += labels.length;
			}

			formattedLabels.push(newLabel);

			i++;

			// Reset color loop.
			if (i > color.last) {
				i = color.first;
			}
		}
	}

	return formattedLabels;
};

function compare(a, b) {
	let aLabel = a.name.toLowerCase();
	let bLabel = b.name.toLowerCase();

	if (aLabel < bLabel) {
		return -1;
	}

	if (aLabel > bLabel) {
		return 1;
	}

	return 0;
}
