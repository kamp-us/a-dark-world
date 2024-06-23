chrome.runtime.onInstalled.addListener(() => {
	chrome.action.setBadgeText({ text: "OFF" });
});

const reducer = (state: "ON" | "OFF") => (state === "OFF" ? "ON" : "OFF");

async function unregisterAllDynamicContentScripts() {
	try {
		const scripts = await chrome.scripting.getRegisteredContentScripts();
		const scriptIds = scripts.map((script) => script.id);
		if (scriptIds.length !== 0) {
			return chrome.scripting.unregisterContentScripts({ ids: scriptIds });
		}
	} catch (error) {
		const message = [
			"An unexpected error occurred while",
			"unregistering dynamic content scripts.",
		].join(" ");
		throw new Error(message, { cause: error });
	}
}

const getState = async (tabId: number) => {
	const state = await chrome.action.getBadgeText({ tabId });
	return state as "ON" | "OFF";
};

chrome.action.onClicked.addListener(async (tab) => {
	if (tab.id === undefined) return;

	const prevState = await getState(tab.id);
	const state = reducer(prevState);

	console.log(`Changing state from ${prevState} to ${state}`);

	if (state === "ON") {
	} else if (state === "OFF") {
		console.log("disabling 'a dark world'");
		await unregisterAllDynamicContentScripts();
	}

	await chrome.action.setBadgeText({ tabId: tab.id, text: state });

	console.log(
		"State changed successfully for tab",
		tab.id,
		"from",
		prevState,
		"to",
		state,
	);
});
