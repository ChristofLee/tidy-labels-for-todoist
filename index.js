// Get the environment variables.
require("dotenv").config();

// Define the Todoist API.
const Todoist = require("todoist").v8;

// Connect to the API.
const todoist = Todoist(process.env.TODOIST_API_KEY);

// A value between 30 and 49, as outlined in the Todoist API documentation.
const color = {
	first: 30,
	last: 49,
};
const maxRetries = 3;
const timer = (ms) => new Promise((res) => setTimeout(res, ms));
const todoistAPITimeLimit = 1000 * 60;
const timerDelay = todoistAPITimeLimit / maxRetries + 1000;

let i = color.first + 1;

(async () => {
	await todoistConnect(async () => {
		// Get labels.
		await todoist.sync(["labels"]);
		const labels = await todoist.labels.get();
		await updateChangedLabels(labels);
	});
})();

async function todoistConnect(connect) {
	for (let tries = 0; tries < maxRetries; tries++) {
		try {
			await connect();
			return;
		} catch (error) {
			switch (error.response.body.http_code) {
				case 429:
					// Retry.
					await timer(timerDelay);

				default:
					console.warn(
						error.response.body.http_code + ": " + error.response.body.error
					);
					break;
			}
		}
	}
}

async function updateChangedLabels(labels) {
	if (labels.length > 0) {
		for (let j = 0; j < labels.length; j++) {
			// Format name of the label.
			let name = labels[j].name;
			name = name.toLowerCase(); // Make the name of the label lowercase
			name = name.replace(" ", "_"); // Replace spaces with underscores.

			let order = j; // Alphabetise the labels.

			// Only update if values are different.
			if (
				labels[j].color != i || // Has the colour changed?
				labels[j].name != name || // Has the name changed?
				labels[j].order != order // Has the order changed?
			) {
				await updateLabel({
					id: labels[j].id,
					color: i,
					name: name,
					item_order: order,
				});
			}

			i++;

			// Reset color loop.
			if (i > color.last) {
				i = color.first;
			}
		}
	}
}

async function updateLabel(newLabel) {
	await todoistConnect(async () => {
		let label = todoist.labels.update(newLabel);
		await label;
	});
}
