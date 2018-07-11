// The onClicked callback function.
function onClickHandler(info, tab) {
	setTimeout(function() {
		chrome.tabs.sendMessage(tab.id, "getClickedEl", function(image) {
			if (image)
				chrome.downloads.download({
					url: image
				});
		});
	}, 500);
}

chrome.contextMenus.onClicked.addListener(onClickHandler);

// Set up context menu tree at install time.
chrome.runtime.onInstalled.addListener(function() {
	// Create one test item for each context type.
	var contexts = ["all"];
	for (var i = 0; i < contexts.length; i++) {
		var context = contexts[i];
		var title = "Download the fisrt image you find";
		var id = chrome.contextMenus.create({
			title: title,
			contexts: [context],
			id: "context" + context
		});
	}
});
