---
title: "HSStockChart介绍"
description: "HSStockChart 是一个绘制股票分时图、K 线图的库。支持流畅的回弹拖动，长按十字线，捏合放大缩小等功能，主要使用了 CAShapeLayer 来绘图，相比使用 Core Graphics 和重写 drawRect 的方法更高效，占用内存更小。GitHub 地址：HSStockChart"
date: 2017-05-03
updated: 2020-10-06
topics: ["Products / Tools"]
tags: ["开源/产品", "HSStockChart", "Products / Tools"]
featured: false
legacyPath: "/2017/05/03/HSStockChart 介绍/"
---
<p>HSStockChart 是一个绘制股票分时图、K 线图的库。支持流畅的回弹拖动，长按十字线，捏合放大缩小等功能，主要使用了 CAShapeLayer 来绘图，相比使用 Core Graphics 和重写 drawRect 的方法更高效，占用内存更小。<br><a href="https://github.com/zyphs21/HSStockChart" target="_blank" rel="noopener">GitHub 地址：HSStockChart</a>  </p>
<p><img src="https://cdn.jsdelivr.net/gh/zyphs21/HSStockChart/DemoScreenshot/HSStockChart.gif" alt=""></p>

## 功能

<ul>
<li><input checked="" disabled="" type="checkbox"> 支持绘制分时图，五日分时图，K 线图，MA 线指标，交易量柱等。</li>
<li><input checked="" disabled="" type="checkbox"> 支持横屏查看。</li>
<li><input checked="" disabled="" type="checkbox"> K 线图利用 <code>UIScrollView</code> 达到流畅的滑动查看效果。</li>
<li><input checked="" disabled="" type="checkbox"> 使用 <code>CAShapeLayer</code> 绘图，内存占用更小，效率更高。</li>
</ul>

## 版本需求

<ul>
<li>iOS 8.0+</li>
<li>Swift 3</li>
</ul>

## 说明

<ol>
<li><p>之前绘图的方法是重写 <code>drawRect</code> 方法，在方法里获取 <code>CGContext</code> 然后利用Core Graphics 来进行绘图，调用 <code>setNeedsDisplay</code> 来刷新。但是这种方法有个问题是：</p>
<blockquote>
<p>一旦你实现了 CALayerDelegate 协议中的 -drawLayer:inContext: 方法或者 UIView 中的 -drawRect: 方法（其实就是前者的包装方法），图层就创建了一个绘制上下文，这个上下文需要的内存可从这个公式得出：图层宽x图层高x4字节，宽高的单位均为像素。对于一个在 Retina iPad 上的全屏图层来说，这个内存量就是 2048x1526x4字节，相当于12MB内存，图层每次重绘的时候都需要重新抹掉内存然后重新分配。【摘自 iOS Core Animation- Advanced Techniques 中文译本 高效绘图一章】</p>
</blockquote>
<p>因为我要达到流畅滑动查看的效果，所以在 <code>UIScrollView</code> 上添加了一个 <code>UIView</code> 这个 View 的宽度会依据当前展示数据的多少而变化，结合 <code>UIScrollView</code> 的 <code>ContentSize</code> 就能达到很好的滑动效果。</p>
</li>
</ol>
<p><img src="https://cdn.jsdelivr.net/gh/zyphs21/HSStockChart/DemoScreenshot/scrollTheory.png" alt=""></p>
<p>  如果我用之前重写 <code>drawRect</code> 的方法，那么这个 View 会根据数据量的变大而变大，从而导致绘图内存急剧上升，数据量大的时候会崩溃。基于此，我采用了 <code>CAShapeLayer</code> 的方式绘图，此方式的特点如下：</p>
<blockquote>
<p>CAShapeLayer 是一个通过矢量图形而不是 bitmap 来绘制的图层子类。你指定诸如颜色和线宽等属性，用 CGPath 来定义想要绘制的图形，最后就自动渲染出来了。当然，你也可以用 Core Graphics 直接向原始的内容中绘制一个路径，相比之下，使用 CAShapeLayer 有以下一些优点:</p>
<ul>
<li>渲染快速。CAShapeLayer 使用了硬件加速，绘制同一图形会比用 Core Graphics 快很多。</li>
<li>高效使用内存。一个 CAShapeLayer 不需要像普通 CALayer 一样创建一个寄宿图形，所以无论有多大，都不会占用太多的内存。 </li>
<li>不会被图层边界剪裁掉，一个 CAShapeLayer 可以在边界之外绘制。你的图层路径不会像在使用 Core Graphics 的普通 CALayer 一样被剪裁掉。</li>
<li>不会出现像素化。当你给 CAShapeLayer 做3D变换时，它不像一个有寄宿图的普通图层一样变得像素化</li>
</ul>
</blockquote>
<p>  最终在真机上测试(注意是在真机上测试)两种方式的结果如图，内存大大降低并且稳定在13M左右</p>
<p><img src="https://cdn.jsdelivr.net/gh/zyphs21/HSStockChart/DemoScreenshot/memoryUseExample.png" alt=""></p>
<ol start="2">
<li>自定义 CAShapeLayer，重写 action(forKey event: String) 方法。目的是 关闭 CAShapeLayer 的隐式动画，避免滑动时候或者十字线出现时有残影的现象(实际上是因为 Layer 的 position 属性变化而产生的隐式动画)</li>
</ol>

```swift
class HSCAShapeLayer: CAShapeLayer {
    override func action(forKey event: String) -> CAAction? {
        return nil
    }
}
```

## License

<p>Released under MIT License.</p>
