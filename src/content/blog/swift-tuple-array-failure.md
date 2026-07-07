---
title: "记一次失败的 Swift 元组数组实践"
description: "想建立一个元组的数组，来简单存放构建 TabViewController 的信息首先我的做法是 1234567let homeTab = (vc: VYHomeViewController(), title: \"Home\", image: \"home_gray\", selectedImage: \"home_blu..."
date: 2017-11-28
updated: 2020-04-17
topics: ["Swift / iOS"]
tags: ["Swift", "Swift / iOS"]
featured: false
legacyPath: "/2017/11/28/记一次失败的 Swift 元组数组实践/"
---
<p>想建立一个元组的数组，来简单存放构建 TabViewController 的信息首先我的做法是</p>

```swift
let homeTab = (vc: VYHomeViewController(), title: "Home", image: "home_gray", selectedImage: "home_blue")
let infoTab = (vc: VYInformationViewController(), title: "Info", image: "home_gray", selectedImage: "home_blue")
let marketTab = (vc: VYMarketViewController(), title: "Market", image: "home_gray", selectedImage: "home_blue")
let userTab = (vc: VYUserCenterViewController(), title: "Me", image: "home_gray", selectedImage: "home_blue")

// 下面报错：Heterogeneous collection literal could only be inferred to '[Any]'; add explicit type annotation if this is intentional
let data = [homeTab, infoTab, marketTab, userTab]
```

<p>但是会报错，Xcode 的修改提示是后面添加  <code>as [Any]</code></p>

```swift
let data = [selfSelectedTab, infoTab, marketTab, userTab] as [Any]
```

<p>但是这样做已经不是原来的做一个元组数组的初衷了。无法在遍历数组的时候使用命名元组来获取信息</p>

<p>接着我用 <code>typealias</code> 的方法改成如下：</p>

```swift
typealias TabInfo = (vc: UIViewController, title: String, image: String, selectedImage: String)

var tabInfo: [TabInfo] = [TabInfo]()
let homeTab = (vc: VYHomeViewController(), title: "Home", image: "home_gray", selectedImage: "home_blue")
let infoTab = (vc: VYHomeViewController(), title: "Info", image: "home_gray", selectedImage: "home_blue")

// 下面报错：Cannot express tuple conversion '(vc: VYInformationViewController, title: String, image: String, selectedImage: String)' to '(vc: UIViewController, title: String, image: String, selectedImage: String)'
tabInfo.append(homeTab)
```

<p>给数组添加元素的时候报错，因为元组不支持类型转换，<code>VYHomeViewController</code> 虽然继承 <code>UIViewController</code>，但是元组看来它们不是同一类型。</p>
<p>最后还是放弃了用元组数组的方法：</p>

```swift
let homeTab = (vc: VYHomePageViewController(), title: Home, image: "new_home_gray", selectedImage: "new_home_blue")
let infoTab = (vc: VYInformationViewController(), title: Info, image: "msg_gray", selectedImage: "msg_blue")
let marketTab = (vc: VYMarketViewController(), title: Market, image: "hangqing_gray", selectedImage: "hangqing_blue")
let userTab = (vc: VYUserCenterViewController(), title: Me, image: "mine_gray", selectedImage: "mine_blue")

addViewController(homeTab.vc, title: homeTab.title, image: homeTab.image, selectedIamge: homeTab.selectedImage)
addViewController(infoTab.vc, title: infoTab.title, image: infoTab.image, selectedIamge: infoTab.selectedImage)
addViewController(marketTab.vc, title: marketTab.title, image: marketTab.image, selectedIamge: marketTab.selectedImage)
addViewController(userTab.vc, title: userTab.title, image: userTab.image, selectedIamge: userTab.selectedImage)
```
