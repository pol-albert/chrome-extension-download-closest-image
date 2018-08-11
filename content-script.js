let clickedEl = null;

this.$ = this.jQu = jQuery.noConflict(true);

document.addEventListener(
	"contextmenu",
	function(event) {
		//right click
		console.log(event.target);
		clickedEl = event.target;
	},
	true
);

function recursivelySearchForImage($elt) {
	var found = "";
	if ($elt.is("img") && $elt.prop("src") && $elt.prop("src") !== "") {
		return $elt.prop("src");
	}
	if ($elt.css("background") && $elt.css("background") !== "") {
		var style =
			$elt.get(0).currentStyle ||
			window.getComputedStyle($elt.get(0), "");
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
	if (found !== "") return found;
	if ($elt.next().length) {
		if (!found) {
			ret = recursivelySearchForImage($elt.next());
			if (ret) {
				found = ret;
			}
		}
	}
	if (found !== "") return found;
	return false;
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if (request == "getClickedEl") {
		var image = recursivelySearchForImage(jQu(clickedEl));

		var appened = $(
			'<div style="background:white;padding:1em;z-index:999999999;position:fixed;top:0;left:0;width:100%">' +
				'Image found ! <br/> <img style="border:2px solid #DDD;float:left;max-width:128px;max-height:128px;" src="' +
				image +
				'"/>' +
				`<form style="float:right;margin-right:2em;" action="https://www.paypal.com/cgi-bin/webscr" method="post">
				    <input type="hidden" name="business"
				        value="polalbert@gmail.com">
				    <input type="hidden" name="cmd" value="_donations">
				    <input type="hidden" name="item_name" value="Download Closest Image Donation">
				    <input type="hidden" name="item_number" value="">
				    <input type="hidden" name="currency_code" value="EUR">
				    <input type="image" name="submit"
				    src="https://www.paypalobjects.com/en_US/i/btn/btn_donate_LG.gif"
				    alt="Donate">
				    <img alt="" width="1" height="1"
				    src="https://www.paypalobjects.com/en_US/i/scr/pixel.gif" >
				</form>` +
				"</div>"
		).appendTo("body");
		setTimeout(function() {
			appened.fadeOut();
		}, 6000);

		sendResponse(image);
	}
});
