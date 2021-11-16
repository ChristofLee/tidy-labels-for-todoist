const color = require("./color");

module.exports = async function formatLabels(labels) {
	let formattedLabels = [];
	let i = color.first;
	if (labels.length > 0) {
		for (let j = 0; j < labels.length; j++) {
			// Format name of the label.
			let name = labels[j].name;
			name = name.toLowerCase(); // Make the name of the label lowercase
			name = name.replace(" ", "_"); // Replace spaces with underscores.

			formattedLabels.push({
				color: i,
				id: labels[j].id,
				name: name,
			});

			i++;

			// Reset color loop.
			if (i > color.last) {
				i = color.first;
			}
		}
	}
	return formattedLabels;
};
