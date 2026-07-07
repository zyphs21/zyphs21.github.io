---
title: "计算地图缩放等级 zoomLevel"
description: "在一些第三方的地图 SDK 中，往往会有 `zoomLevel` 这样一个属性，常用于设置地图的缩放等级。 但是在 iOS 自带的地图控件 `MKMapView` 是没有这样一个属性的。取而代之的是利用 `MKCoordinateRegion` 和 `MKCoordinateSpan` 来配置地图显示的中心和区域缩放的大小。那么我们如何计算其 zoomLev"
date: 2019-05-08
updated: 2020-04-20
topics: ["Geometry / Algorithms"]
tags: ["算法实践", "Map", "Geometry / Algorithms"]
featured: false
legacyPath: "/2019/05/08/计算地图缩放等级 zoomLevel/"
---
## 背景及问题分析

<p>在一些第三方的地图 SDK 中，往往会有 <code>zoomLevel</code> 这样一个属性，常用于设置地图的缩放等级。</p>
<p>但是在 iOS 自带的地图控件 <code>MKMapView</code> 是没有这样一个属性的。取而代之的是利用 <code>MKCoordinateRegion</code> 和 <code>MKCoordinateSpan</code> 来配置地图显示的中心和区域缩放的大小。</p>

### MKCoordinateRegion 和 MKCoordinateSpan

<p>我们先来看看 <code>MKCoordinateRegion</code> 和 <code>MKCoordinateSpan</code> 的这两个初始化方法：</p>

```text
MKCoordinateRegion(center: CLLocationCoordinate2D, span: MKCoordinateSpan)
MKCoordinateSpan(latitudeDelta: CLLocationDegrees, longitudeDelta: CLLocationDegrees)
```

<p>结合 <a href="https://developer.apple.com/documentation/mapkit/mkcoordinatespan" target="_blank" rel="noopener">文档</a> ，我们可以将 <code>MKCoordinateRegion</code> 理解为地图上一块方形区域， <code>center</code> 是这块方形区域的中心地理坐标，而 <code>MKCoordinateSpan</code> 是这块区域的 <strong>经纬度范围</strong>，那么它的两个参数的取值范围是：</p>
<ul>
<li>latitudeDelta：[0, 180]</li>
<li>longitudeDelta: [0, 360]</li>
</ul>
<img src="https://cdn.jsdelivr.net/gh/zyphs21/cdn-assets/photo/zoomlevel/lnglatDelta.jpg" width = "450" height = "320" alt="" align=center />

## Tiled web map

<p>了解了 <code>MKCoordinateRegion</code> 和 <code>MKCoordinateSpan</code> 后，我们该如何利用它们来计算出 <code>zoomLevel</code> 呢？这里我们需要先了解一下 <a href="https://en.wikipedia.org/wiki/Tiled_web_map" target="_blank" rel="noopener">Tiled web map</a> 这个概念。<code>Tiled web map</code> 的设计初衷是为了能在网络上更好的传输和展示地图，其中最早应用起来的是 <code>Google Maps</code>， 然后慢慢地成为了地图工具中一个不成文的标准。它把地图以图片的形式切割成很多个小块: <code>Tile</code>，当用户在地图上滑动或者缩放时，就会加载更多的 <code>Tile</code>，对比以前直接加载一大块图片的方式效率更高，用户体验更好。</p>
<p>大部分的 <code>Tiled web map</code> 会依据 Google Maps 的一些实现标准：</p>
<ul>
<li>一个 <code>Tile</code> 是 256x256 像素。</li>
<li>zoom Level 为 0 时，整个世界地图可以显示在单个 <code>Tile</code> 上。</li>
<li>每增加一个地图缩放等级，一个 <code>Tile</code> 的像素会加倍。也就是说一个 <code>Tile</code> 会被四个 <code>Tile</code> 替换掉。</li>
</ul>
<p><img src="https://cdn.jsdelivr.net/gh/zyphs21/cdn-assets/photo/zoomlevel/tileMap.jpg" alt=""></p>
<blockquote>
<p>上面原图片来自 <a href="http://troybrant.net/blog/2010/01/mkmapview-and-zoom-levels-a-visual-guide/" target="_blank" rel="noopener">troybrant.net</a>，由原图拼接而成。</p>
</blockquote>
<p>根据上面的标准，我们可以得出这样一个公式：</p>
<p>$W=256 \times 2^{zoomlevel}$</p>
<p>W 表示地图一边长的像素。</p>

## zoomLevel 算法解析

<p>我们知道地球经度一周360度，那么一个经度范围占 <code>Tiled web map</code> 的多少像素呢？简单的除法可以得知：</p>
<p>$\frac{360}{256 \times 2^{zoomlevel}}$</p>
<p>上面说到 <code>MKCoordinateSpan</code> 它表示地图显示区域的 <strong>经纬度范围</strong>，假设我们把 <code>MKMapView</code> 的宽度设置为 <code>width</code>, 而 <code>MKCoordinateSpan.longitudeDelta</code> 是当前 <code>MKMapView</code> 显示区域的<strong>经度</strong>范围。那么我们可以得到这样一个等式：</p>
<p>$\frac{360}{256 \times 2^{zoomlevel}} = \frac{longitudeDelta}{width}$</p>
<p>一个简单的转换，即可得出 <code>zoomLevel</code> 的计算公式：</p>
<p>$zoomLevel = log_2{\frac{360 \times width}{longitudeDelta \times 256}}$</p>

## 示例代码

<p>用代码形式展示：</p>

```swift
let mapWidth = mapView.frame.size.width
let zoomLevel = log2(360 * Double(mapWidth) / 256.0 / mapView.region.span.longitudeDelta)
```

<p>我们还可以给 <code>MKMapView</code> 扩展一下：</p>

```swift
extension MKMapView {
    var zoomLevel: Double {
        return log2(360 * Double(frame.size.width) / 256.0 / region.span.longitudeDelta)
    }
}
```

## 参考资料

<ul>
<li><a href="https://en.wikipedia.org/wiki/Tiled_web_map" target="_blank" rel="noopener">维基百科: Tiled web map</a></li>
<li><a href="https://blog.mapbox.com/512-map-tiles-cb5bfd6e72ba" target="_blank" rel="noopener">Mapbox Medium blog: 512 map tiles</a></li>
<li><a href="https://stackoverflow.com/questions/4189621/setting-the-zoom-level-for-a-mkmapview/15020534#15020534" target="_blank" rel="noopener">Stackoverflow: Setting the zoom level for a MKMapView</a></li>
<li><a href="http://troybrant.net/blog/2010/01/mkmapview-and-zoom-levels-a-visual-guide/" target="_blank" rel="noopener">troybrant blog: mkmapview and zoom levels a visual guide</a></li>
<li><a href="https://www.microimages.com/documentation/TechGuides/80TilesetZoom.pdf" target="_blank" rel="noopener">Microimages: Setting Zoom Levels</a></li>
</ul>
<details open>
<summary><strong>欢迎关注我的公众号</strong></summary>

<table>
<thead>
<tr>
<th align="center">HansonTalk</th>
<th align="center">iOSTypist</th>
</tr>
</thead>
<tbody><tr>
<td align="center"><img src="https://cdn.jsdelivr.net/gh/zyphs21/cdn-assets/qrcode/HansonTalk.jpg" alt="HansonTalk" align=center /></td>
<td align="center"><img src="https://cdn.jsdelivr.net/gh/zyphs21/cdn-assets/qrcode/iOSTypist.jpg" alt="iOSTypist" align=center /></td>
</tr>
</tbody></table>
</details>
