---
title: "一点 MacCatalyst 适配经验分享"
description: "最近通过 Mac Catalyst 把 ImageGotcha 带到了 macOS 上，这里简单做点分享"
date: 2020-12-13
updated: 2020-12-23
topics: ["Swift / iOS"]
tags: ["iOS开发", "macOS", "Mac Catalyst", "Swift / iOS"]
featured: false
legacyPath: "/2020/12/13/MacCatalyst适配经验分享/"
---
<p>最近把我做的一个小App：<a href="https://apps.apple.com/cn/app/imagegotcha/id1384107130" target="_blank" rel="noopener">ImageGotcha</a> 的 macOS 版本提交审核了。通过 Mac Catalyst 把 iOS App 带到 macOS 上，整体体验还不错，当然也可能是因为我的 App 相对简单，但是还是有不少坑和需要适配的地方，这里简单做点分享。</p>

## 移除 TitleBar

<p>运行在 macOS 上默认会生成一个 TileBar，如果我们使用了 NavigationBar  则会出现两个头的现象，很不美观，所以可以移除这个 TiltleBar。</p>
<p><img src="https://cdn.jsdelivr.net/gh/zhenwanping/cdn-assets@master/photo/20201112103950.png" alt="隐藏TitleBar"></p>
<p>可以在合适的地方加入下面的代码，比如在 SceneDelegate 的 sceneWillConnectToSession 里：</p>

```swift
func scene(_ scene: UIScene, willConnectTo session: UISceneSession, options connectionOptions: UIScene.ConnectionOptions) {

  guard let windowScene = (scene as? UIWindowScene) else { return }

  #if targetEnvironment(macCatalyst)
  if let titlebar = windowScene.titlebar {
    titlebar.titleVisibility = .hidden
    titlebar.toolbar = nil
  }
  #endif
}
```

## CollectionViewLayout 布局问题

<p>macOS 上运行的 App 如果不加限制，App 的窗口几乎是可以随意拉伸，拖到拖小的。这就导致原本布局好的 CollectionViewCell 可能不是很美观，最好的情况是可以适配窗口大小的变化而变化。</p>
<p>在 UICollectionViewLayout 里有个方法</p>

```swift
@available(iOS 7.0, macCatalyst 13.0, *)
open func invalidateLayout(with context: UICollectionViewLayoutInvalidationContext)
```

<p>这个方法会在每次 App 窗口大小变化的时候被触发，可以在这里面进行重新布局。</p>
<p>这里就涉及如何获取当前的窗口大小问题了，我们常用的 <code>UIScreen.main.bounds</code> 在 macOS 上已经不适用了。</p>

## 获取窗口实际大小

<p>这里需要获取当前 Active 的 <code>UIWindowScene</code> ，然后通过它的 <code>coordinateSpace</code> 拿到 bounds 信息：</p>

```swift
extension UIApplication {
    var activeWindowScene: UIWindowScene? {
        self.connectedScenes
            .filter { $0.activationState == .foregroundActive }
            .compactMap { $0 as? UIWindowScene }.first
    }
}

UIApplication.shared.activeWindowScene.coordinateSpace.bounds
```

## UICollectionView 多选交互问题

<p>在 macOS 上，多选 CollectionView，是需要按住 commad 键进行点击，或者按住 Shift 键区间选择。这个与在 iOS 上的交互是不一样的。可以参考下面的内容：</p>
<blockquote>
<p><a href="https://stackoverflow.com/questions/60856636/mac-catalyst-tableview-allowmultipleselection-not-working" target="_blank" rel="noopener">https://stackoverflow.com/questions/60856636/mac-catalyst-tableview-allowmultipleselection-not-working</a></p>
<p>Multiple selection on macOS Catalyst does not work in quite the same way as on iOS and iPadOS and this appears to be either a bug or an unfortunate choice of intended behavior.</p>
<p>On macOS Catalyst, if you have enabled multiple selection in edit mode by setting tableView.allowsMultipleSelectionDuringEditing to true, only one row at a time can be directly selected by clicking with the pointer. However, multiple selection of contiguous rows is enabled by selecting a first row and then holding down SHIFT while selecting a second row, and multiple selection of non-contiguous rows is enabled by selecting a first row and then holding down COMMAND while selecting additional rows. This is Mac-like behavior in that it is how multiple selection generally works on macOS. So it is possible that this was intended behavior. But if that is the case, it is behavior that is hard to discover, not what an iOS/iPadOS user might expect, and works differently than on iOS and iPadOS. And it causes other problems - for example, in code I have a “Select All” function that is able to select all rows from code on iOS/iPadOS, and this code doesn’t work on macOS Catalyst.</p>
<p>I filed Feedback on this. There is a simple project on GitHub at <a href="https://github.com/WB2ISS/MultipleSelection" target="_blank" rel="noopener">WB2ISS/MultipleSelection</a> that demonstrates the problem.</p>
</blockquote>

## App icon 提示缺失 1024像素的问题

<p>一切就绪，提交审核的时候，突然遇到了这个无法审核的提示：</p>

```text
Xcode 的素材目录中必须添加 1024 x 1024 像素的 App 图标。
```

<p>但是实际上我的 Assets.xcassets 里的 AppIcon 里已经包含这个 1024x1024 的图标了。</p>
<p>后面发现需要在 AppIcon 的 Attribute Inspector 里勾上 Mac：</p>
<p><img src="https://cdn.jsdelivr.net/gh/zhenwanping/cdn-assets@master/photo/20201212130544.png" alt="image-20201212130453439"></p>
<p>然后就会发现多了 Mac App Store 需要的 1024x1024 图标了，把它添加进去，重新打包上传到 App Store Connect 就行</p>
<p><img src="https://cdn.jsdelivr.net/gh/zhenwanping/cdn-assets@master/photo/20201212130656.png" alt="image-20201212130653774"></p>
<p>要是这个提示能早点提示就好，没想到是等到最后提交审核的时候才会提示。</p>
