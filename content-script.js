var image = null;

this.$ = this.jQu = jQuery.noConflict(true);

document.addEventListener(
	"contextmenu",
	function(event) {
		//right click
		if (event.button == 2) {
			let clickedEl = event.target;
			image = recursivelySearchForImage(jQu(clickedEl));
		}
	},
	true
);

function recursivelySearchForImage($elt) {
	var found = false;
	if ($elt.is("img") && $elt.prop("src") && $elt.prop("src") !== "") {
		return $elt.prop("src");
	}
	if ($elt.css("background") && $elt.css("background") !== "") {
		var style =
			$elt.get(0).currentStyle ||
			window.getComputedStyle($elt.get(0), false);
		var url = style.backgroundImage.slice(4, -1).replace(/"/g, "");
		if (url !== "" && url !== "none") return url;
	}
	var ret;
	$elt.children().each(function(i, e) {
		if (!found) {
			ret = recursivelySearchForImage(jQu(e));
			if (ret) {
				found = ret;
			}
		}
	});
	if (found) return found;
	if ($elt.next().length) {
		if (!found) {
			ret = recursivelySearchForImage($elt.next());
			if (ret) {
				found = ret;
			}
		}
	}
	if (found) return found;
	return false;
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if (request == "getClickedEl") {
		sendResponse(image);
	}
});
