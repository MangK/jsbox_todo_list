exports.init = () => {
    var extensions = $cache.get("extensions") || []
    $ui.render({
        props: {
            title: "Todo List"
        },
        views: [
            {
                type: "button",
                props: {
                    title: "输入"
                },
                layout: function (make) {
                    make.left.inset(10)
                    make.top.inset(10)
                    make.size.equalTo($size(($device.info.screen.width) / 2 - 15, 50))
                },
                events: {
                    tapped: function (sender) {
                        keybordInsertItem()
                    }
                }
            },
            {
                type: "button",
                props: {
                    title: "语音"
                },
                layout: function (make) {
                    make.left.inset(($device.info.screen.width) / 2 + 5)
                    make.top.inset(10)
                    make.size.equalTo($size(($device.info.screen.width) / 2 - 15, 50))
                },
                events: {
                    tapped: function (sender) {
                        voiceInsertItem()
                    }
                }
            },
            {
                type: "list",
                props: {
                    id: "list",
                    reorder: true,
                    actions: [
                        {
                            title: "delete",
                            handler: function (sender, indexPath) {
                                deleteItem(indexPath)
                            }
                        }
                    ]
                },
                layout: function (make) {
                    make.left.bottom.right.equalTo(0)
                    make.top.equalTo($("button").bottom).offset(10)
                },
                events: {
                    didSelect: function (sender, indexPath, title) {
                        $app.openExtension(title)
                    },
                    reorderMoved: function (from, to) {
                        extensions.move(from.row, to.row)
                    },
                    reorderFinished: function () {
                        saveItems()
                    }
                }
            }
        ]
    })

    var listView = $("list")
    listView.data = extensions

    function insertItem(text) {
        extensions.unshift(text)
        listView.insert({
            index: 0,
            value: text
        })
        saveItems()
    }

    function deleteItem(indexPath) {
        var text = extensions[indexPath.row]
        var index = extensions.indexOf(text)
        if (index >= 0) {
            extensions.splice(index, 1)
            saveItems()
        }
    }

    function keybordInsertItem() {
        $ui.push({
            props: {
                title: "所有扩展"
            },
            views: [
                {
                    type: "list",
                    props: {
                        data: $file.extensions
                    },
                    layout: $layout.fill,
                    events: {
                        didSelect: function (sender, indexPath, title) {
                            insertItem(title)
                            $ui.pop()
                        }
                    }
                },
                {
                    type: "input",
                    props: {
                        type: $kbType.search,
                        darkKeyboard: true,
                        clearsOnBeginEditing: true,
                        align: $align.left
                    },
                    layout: function (make, view) {
                        // make.center.equalTo(view.super)
                        make.size.equalTo($size($device.info.screen.width, 100))
                    },
                    events: {
                        returned: function(sender) {
                            console.log(sender.text)
                        }
                    },
                },
            ]
        })
    }
    function voiceInsertItem() {
        $input.speech({
            locale: "zh-CN", // 可选
            autoFinish: true, // 可选
            handler: function (text) {
            }
        })
    }

    function saveItems() {
        $cache.set("extensions", extensions)
    }

    Array.prototype.move = function (from, to) {
        var object = this[from]
        this.splice(from, 1)
        this.splice(to, 0, object)
    }
}