exports.init = () => {
    $ui.render({
        props: {
            title: "Todo List"
        },
        views: [
            {
                type: "view",
                props: {
                    bgcolor: $color("#ccc12c")
                },
                layout: function (make, view) {
                    make.center.equalTo(view.super)
                    make.left.bottom.right.equalTo(0)
                },
                views: [
                    {
                        id: "inputButton",
                        type: "button",
                        props: {
                            title: "输入"
                        },
                        layout: function (make, view) {
                            make.left.equalTo(10)
                            make.bottom.equalTo(-40)
                            make.size.equalTo($size(($device.info.screen.width) / 2 - 15, 40))
                        },
                        events: {
                            tapped: function (sender) {
                                keybordInsertItem()
                            }
                        }
                    },
                    {
                        id: "voiceButton",
                        type: "button",
                        props: {
                            title: "语音"
                        },
                        layout: function (make) {
                            make.left.inset(($device.info.screen.width) / 2 + 5)
                            make.bottom.equalTo(-40)
                            make.size.equalTo($size(($device.info.screen.width) / 2 - 15, 40))
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
                            bgcolor: $color("#cccccc"),
                            actions: [
                                {
                                    title: "delete",
                                    handler: function (sender, indexPath) {
                                        deleteItem(indexPath)
                                    }
                                },
                                {
                                    title: "完成",
                                    handler: function (sender, indexPath) {
                                        // deleteItem(indexPath)
                                    }
                                },
                            ]
                        },
                        layout: function (make) {
                            make.left.right.equalTo(0)
                            make.top.equalTo(0)
                            make.bottom.equalTo(-90)
                        },
                        events: {
                            //点击
                            didSelect: function (sender, indexPath, title) {
                                console.log(title)
                            },
                            //移动
                            reorderMoved: function (from, to) {
                                extensions.move(from.row, to.row)
                            },
                            //？？重载
                            reorderFinished: function () {
                                saveItems()
                            }
                        }
                    },
                ]
            },
        ]
    })

    //初始化
    var extensions = $cache.get("extensions") || []
    var query = $context.query
    console.log(query)
    var listView = $("list")
    listView.data = (() => {
        const result = [];
        for (let idx = 0; idx < extensions.length; ++idx) {
            result.push(extensions[idx].data);
        }
        return result;
    })()
    
    //插入元素
    function insertItem(text) {
        var obj = {
            data: text,
            time: new Date().getTime()
        }
        extensions.unshift(obj)
        listView.insert({
            index: 0,
            value: obj.data
        })
        saveItems()
    }

    //删除元素
    function deleteItem(indexPath) {
        var text = extensions[indexPath.row]
        var index = extensions.indexOf(text)
        if (index >= 0) {
            extensions.splice(index, 1)
            saveItems()
        }
    }

    //手动输入
    function keybordInsertItem() {
        $ui.push({
            props: {
                title: "新建"
            },
            views: [
                {
                    type: "input",
                    props: {
                        type: $kbType.search,
                        darkKeyboard: true,
                        clearsOnBeginEditing: true,
                        align: $align.left
                    },
                    layout: function (make, view) {
                        make.size.equalTo($size($device.info.screen.width, 100))
                    },
                    events: {
                        returned: function (sender) {
                            insertItem(sender.text)
                            $ui.pop()
                        }
                    },
                },
            ]
        })
    }

    //语音输入
    function voiceInsertItem() {
        $input.speech({
            locale: "zh-CN", // 可选
            autoFinish: false, // 可选
            handler: function (text) {
                insertItem(text)
                $ui.pop()
            }
        })
    }

    //将内容加入缓存
    function saveItems() {
        $cache.set("extensions", extensions)
    }

    Array.prototype.move = function (from, to) {
        var object = this[from]
        this.splice(from, 1)
        this.splice(to, 0, object)
    }
}