// The onClicked callback function.
function onClickHandler(info, tab) {
	chrome.tabs.sendMessage(tab.id, "getClickedEl", function(image) {
		if (image) {
			if (info.menuItemId.indexOf("dl") === 0) {
				chrome.downloads.download({
					url: image
				});
			} else if (info.menuItemId.indexOf("copyUrl") === 0) {
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
	var contexts = ["page", "frame", "selection", "link", "editable", "image"];
	for (var i = 0; i < contexts.length; i++) {
		var context = contexts[i];
		var id = chrome.contextMenus.create({
			id: "dl." + context,
			title: "↧ Download the image",
			contexts: [context]
		});
		id = chrome.contextMenus.create({
			id: "copyUrl." + context,
			title: "📋 Copy URL of the image",
			contexts: [context]
		});
	}
});
