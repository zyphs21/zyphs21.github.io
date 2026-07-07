---
title: "在Swift扩展里添加\"存储属性\""
description: "能在 Swift 扩展里添加”存储属性”吗？"
date: 2018-07-17
updated: 2020-04-17
topics: ["Swift / iOS"]
tags: ["Swift", "Swift / iOS"]
featured: false
legacyPath: "/2018/07/17/在Swift扩展里添加\"存储属性\"/"
---
<p>能在 Swift 扩展里添加”存储属性”吗？</p>

## 由来

<p>最近 <a href="https://itunes.apple.com/cn/app/imagegotcha/id1384107130?mt=8" target="_blank" rel="noopener">ImageGotcha</a> 收到了第一封用户反馈的邮件。<br><br>这个用户希望可以有 <code>Dark Mode</code>。<code>ImageGotcha</code> 只是一个工具类 <code>App</code> ，好像也没有什么必要加上这个黑夜模式，不过我还是去想了想如何给应用加上黑夜模式，或者说加上一个换肤的功能。</p>
<p>基本的思路就是 <code>post</code> 一个自定义的 <code>NSNotification</code>，然后在需要修改颜色的地方监听这个通知然后进行修改。<br>按照惯例，我还是去 <code>Github</code> 上搜搜，看看别人是怎么做的。然后发现一部分人的做法是给现有的 <code>UIKit</code> 控件添加扩展属性，然后可以在定义这些控件的时候指定不同模式下的颜色，这的确是一种好方法。那么是如何在 <code>Swift</code> 的 <code>Extension 扩展</code> 里添加所谓的<code>&quot;存储属性&quot;</code>呢？</p>
<p>我们都知道，在 <code>Swift</code> 的 <code>Extension</code> 里是不能添加<code>存储属性</code>的，这里可以类比 <code>Objective-C</code>的 <code>Category 分类</code>，分类是不能添加实例变量和属性的。</p>

## 疑问

<p>这里就有个问题了，为什么不能添加呢？</p>
<blockquote>
<p>因为不管是 <code>Swift</code> 的 <code>Extension</code> 还是 <code>Objective-C</code> 的 <code>Category</code> 都不能改变原有的类或者结构体的内存结构，在实例化这些类的时候，内存结构是确定的，而添加属性或者实例变量需要内存空间，会改变原有的内存结构。</p>
</blockquote>

## 利用关联对象

<p>在 <code>Objective-C</code> 中我们常常用运行时 <code>Associated Object 关联对象</code> 来给 <code>Category</code> 添加属性，而在 <code>Swift</code> 里，我们同样可以利用关联对象在 <code>Extension</code> 中添加计算属性，以达到所谓的<code>存储属性</code>的效果。</p>

```swift
struct AssociatedKeys {
    static var testNameKey: String = "testNameKey"
}

extension UIView {
    public var testName: String? {
        get {
            return objc_getAssociatedObject(self, &AssociatedKeys.testNameKey) as? String
        }
        set {
            objc_setAssociatedObject(self, &AssociatedKeys.testNameKey, newValue, .OBJC_ASSOCIATION_RETAIN_NONATOMIC)
        }
    }
}
```

<p><code>&amp;AssociatedKeys.testNameKey</code>: <code>&amp;</code> 操作符是取出地址作为 <code>UnsafeRawPointer</code> 参数传入。<br><code>.OBJC_ASSOCIATION_RETAIN_NONATOMIC</code>: 是一个 <code>objc_AssociationPolicy</code> 枚举，它有以下几种选择(从字面意思可以猜测是与Objective-C中的属性修饰符相关)：</p>

```text
public enum objc_AssociationPolicy : UInt {
    case OBJC_ASSOCIATION_ASSIGN
    case OBJC_ASSOCIATION_RETAIN_NONATOMIC
    case OBJC_ASSOCIATION_COPY_NONATOMIC
    case OBJC_ASSOCIATION_RETAIN
    case OBJC_ASSOCIATION_COPY
}
```

<p>我们可以测试一下：</p>

```text
var testString = "test"

let view = UIView()

view.testName = testString
print(view.testName) // 输出 Optional("test")

testString.append("change")
print(view.testName) // 输出 Optional("test")

view.testName = "testChange"
print(view.testName) // 输出 Optional("testChange")
```
