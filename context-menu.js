// The onClicked callback function.
function onClickHandler(info, tab) {
	chrome.tabs.sendMessage(tab.id, "getClickedEl", function(image) {
		if (image) {
			if (info.menuItemId == "dl") {
				chrome.downloads.download({
					url: image
				});
			} else if (info.menuItemId == "copyUrl") {
				copyToClipboard(image);
			}
		}
	});
}

function copyToClipboard(str) {
	document.oncopy = function(event) {
		event.clipboardData.setData("text/plain", str);
		event.preventDefault();
	};
	document.execCommand("copy", false, null);
}

chrome.contextMenus.onClicked.addListener(onClickHandler);

// Set up context menu tree at install time.
chrome.runtime.onInstalled.addListener(function() {
	// Create one test item for each context type.
	var contexts = ["all"];
	for (var i = 0; i < contexts.length; i++) {
		var context = contexts[i];
		var title = "↧ Download the image";
		var id = chrome.contextMenus.create({
			id: "dl",
			title: title,
			contexts: [context]
		});
		var title = "📋 Copy URL of the image";
		id = chrome.contextMenus.create({
			id: "copyUrl",
			title: title,
			contexts: [context]
		});
	}
});
