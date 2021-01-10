const util = require("./util");

exports.init = () => {
	var extensions = $cache.get("extensions") || []
	var views = []
	console.log(extensions)
	extensions.forEach(element => {
		views.push({
			type: "text",
			props: {
				text: element
			}
		})
	})
	$widget.setTimeline(ctx => {
		return {
			type: "vstack",
			props: {
				alignment: $widget.horizontalAlignment.center,
				spacing: 20
			},
			views: views
		}
	})
}