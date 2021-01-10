const util = require("./util");
const fonts = {
	primary: { size: 19 },
	secondary: { size: 13 }
}
const colors = {
	systemBlue: $color("#007aff", "#0a84ff"),
	secondary: $color("#666666", "#acacac")
}

exports.init = () => {
	var extensions = $cache.get("extensions") || []
	$widget.setTimeline(ctx => {
		return {
			type: "vstack",
			props: {
				alignment: $widget.horizontalAlignment.center,
			},
			views: (() => {
				const result = [];
				for (let idx = 0; idx < extensions.length; ++idx) {
					result.push(listItem(extensions[idx], idx === 0 ? 1 : 0.6));
				}
				return result;
			})()
		}
	})
}

function listItem(item, lineOpacity) {
	return {
		type: "hstack",
		props: {
			spacing: 8,
			alignment: "center",
			link: "jsbox://run?name=BWL&time=" + item.time
		},
		views: [
			{
				type: "color",
				props: {
					color: colors.systemBlue,
					frame: {
						width: 6,
						height: 44
					},
					cornerRadius: 3,
					opacity: lineOpacity
				}
			},
			{
				type: "vstack",
				props: {
					alignment: "leading",
					frame: {
						maxWidth: Infinity,
						maxHeight: Infinity,
						alignment: "leading"
					},
					// link: item
				},
				views: [
					{
						type: "text",
						props: {
							text: item.data,
							lineLimit: 1,
							font: fonts.primary,
							bold: true
						}
					},
					{
						type: "vstack",
						props: {
							frame: { height: 4 }
						}
					},
					{
						type: "text",
						props: {
							text: item.data,
							font: fonts.secondary,
							color: colors.secondary
						}
					}
				]
			}
		]
	}
}