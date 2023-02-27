// Get the environment variables.
require("dotenv").config();

// Define the Todoist API.
const Todoist = require("todoist").v9;

// Connect to the API.
const todoist = Todoist(process.env.TODOIST_API_KEY);

const formatLabels = require("./lib/format-labels");
const joinItemsToLabels = require("./lib/join-items-to-labels");

(async () => {
	await todoistConnect(async () => {
		// Get labels.
		await todoist.sync(["items", "labels"]);
		const items = await todoist.items.get();
		const labels = await todoist.labels.get();
		const labelsAndTasks = await joinItemsToLabels(items, labels);
		const formattedLabels = await formatLabels(labelsAndTasks);
		await updateChangedLabels(labels, formattedLabels);
	});
})();

async function todoistConnect(connect) {
	const maxRetries = 3;
	const timer = (ms) => new Promise((res) => setTimeout(res, ms));
	const todoistAPITimeLimit = 1000 * 60;
	const timerDelay = todoistAPITimeLimit / maxRetries + 1000;

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

async function updateChangedLabels(labels, formattedLabels) {
	if (labels.length > 0) {
		for (let i = 0; i < labels.length; i++) {
			// Only update if values are different.
			if (
				labels[i].color != formattedLabels[i].color || // Has the colour changed?
				labels[i].name != formattedLabels[i].name ||
				labels[i].item_order != formattedLabels[i].item_order
			) {
				await updateLabel(formattedLabels[i]);
			}
		}
	}
}

async function updateLabel(newLabel) {
	await todoistConnect(async () => {
		await todoist.labels.update(newLabel);
	});
}
