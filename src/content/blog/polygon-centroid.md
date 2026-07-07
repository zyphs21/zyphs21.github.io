---
title: "计算一个多边形的重心点坐标"
description: "多边形分凹多边形和凸多边形，如何求出一个多边形的重心坐标呢？"
date: 2019-05-05
updated: 2020-04-17
topics: ["Geometry / Algorithms"]
tags: ["算法实践", "Geometry", "Geometry / Algorithms"]
featured: false
legacyPath: "/2019/05/05/计算一个多边形的重心点坐标/"
---
## 背景介绍与问题分析

<p>在之前的《如何判断一个多边形是否合法》 一文中有提到，用无人机规划飞行路线前，往往需要框选一个多边形的区域。</p>
<p>而在地图控件上显示这个多边形区域时，往往会遇到这样一个需求：需要把所要测绘的多边形区域移动到地图中心。</p>
<p>实现这个需求的基本思路就是：获取到多边形区域的重心点坐标，然后利用地图控件的 <code>setCenter</code>方法，就可以把地图的显示中心移动到多边形区域重心了。那么问题来了，如何求出一个多边形的重心点坐标呢？</p>
<blockquote>
<p>这里所说的重心，也常常叫几何中心</p>
</blockquote>
<p>这里首先给出一个公式:</p>
<p>平面多边形 $X$ 可以被剖分为 n个有限的简单图形 $X_1,X_2,….X_n$，这些简单图形的重心点为 $C_1$，面积为 $A_1$，那么这个平面多边形的重心点坐标为 $(C_x,C_y)$<br>$$C_x = \frac{\sum C_{i_x} A_i}{\sum A_i}, C_y = \frac{\sum C_{i_y} A_i}{\sum A_i}$$</p>
<blockquote>
<p>公式参考: <a href="https://en.wikipedia.org/wiki/Centroid#Centroid_of_polygon" target="_blank" rel="noopener">维基百科</a></p>
</blockquote>
<p>一般来说我们可以给多边形进行三角剖分，而 $\sum{A_i}$ 即为多边形的总面积，那么这个公式可以理解为：</p>
<p>多边形重心横坐标 = 多边形剖分的每一个三角形重心的横坐标 * 该三角形的面积之和 / 多边形总面积</p>
<p>多边形重心纵坐标 = 多边形剖分的每一个三角形重心的纵坐标 * 该三角形的面积之和 / 多边形总面积</p>
<p>所以这里就把问题拆分成了三个小问题：</p>
<ul>
<li>求每个剖分出来的三角形的重心。</li>
<li>求每个剖分出来的三角形的面积。</li>
<li>求多边形的面积。</li>
</ul>

## 算法解析

### 1. 求三角形的重心

<p><img src="https://user-gold-cdn.xitu.io/2019/4/30/16a6cfc2430378e5?w=495&h=359&f=png&s=6343" alt="三角形重心"><br>三角形的重心：三条中线的交点。其中重心到其中一个顶点的距离是重心到该顶点对边中点的距离的2倍。<br />即：GC = 2 * GP，也就是说重心坐标在 CP 线段上距离 AB 的中点 P 的 1/3 处。<br>假设 A,B,C 三点的坐标为：<br>$$A:(x_1,y_1),B:(x_2,y_2),C:(x_3,y_3)$$</p>
<p>那么通过简单坐标计算，可以得出其重心坐标为 $(x,y)$<br>$$x = \frac{(x_1+x_2+x_3)}{3} , y = \frac{(y_1+y_2+y_3)}{3}$$</p>

### 2. 求三角形面积

<p>计算三角形的面积，我们这里利用 <code>向量积</code>来计算，我们知道平面中的两个向量的叉乘的模等于以这两个向量为边的平行四边形的面积，那么以这个两个向量为边的三角形，则是这个平行四边形的面积的一半。</p>
<blockquote>
<p>参考：<a href="https://zh.wikipedia.org/wiki/%E5%8F%89%E7%A7%AF" target="_blank" rel="noopener">向量叉积</a></p>
</blockquote>
<p><img src="https://user-gold-cdn.xitu.io/2019/4/30/16a6cfc2411ec119?w=426&h=271&f=png&s=3768" alt=""></p>
<p>如上图，已知平面上两点 $A:(x_1,y_1),B(x_2,y_2)$ ，以 A，B和坐标原点 $P(0,0)$ 构成的三角形的面积 S 为：<br>$$S=\frac{\vec{PB}\times\vec{PA}}{2} = \frac{x_2y_1 - x_1y_2 }{2}$$</p>
<p>这里给出运算草稿：<br><img src="https://user-gold-cdn.xitu.io/2019/4/30/16a6cfc2446ff8cb?w=845&h=215&f=png&s=225564" alt=""></p>
<p>为什么这里我们会以原点作为第三个点构成三角形呢？其实是跟接下来求多边形面积是有关联的。</p>

### 3. 求多边形的面积

<p>我们在上面给出的求平面多边形重心的公式中有说到，一般我们会把多边形剖分为多个三角形。<br>那么这个剖分点 P 我们可以设在哪里呢？这里先给出结论：这个剖分点可以设置在多边形的内部，也可以设置到外部。</p>
<p><img src="https://user-gold-cdn.xitu.io/2019/4/30/16a6cfc2424f444d?w=493&h=243&f=png&s=7753" alt=""></p>
<p>为什么这个剖分点可以设置到外部呢？我们可以通过简单的三角形情况来推广到多边形的情况。<br>对于三角形ABC，我们把剖分点设置在其外部 P 的一点上<br><img src="https://user-gold-cdn.xitu.io/2019/4/30/16a6cfc24423917c?w=381&h=260&f=png&s=5277" alt=""></p>
<p>如果大家还记得 <a href="https://juejin.im/post/5cc7eea351882512fa03a481" target="_blank" rel="noopener">《如何判断一个多边形是否合法》</a> 一文中有讲过向量叉积是有正负之分的，并且根据上面所说的计算三角形面积，那么以 P 为剖分点，通过向量积可以得出这个三角形的面积 A 为：<br>$$A = \frac{1}{2}(\vec{PB} \times \vec{PC} + \vec{PC} \times \vec{PA} + \vec{PA} \times \vec{PB})$$</p>
<p>因为 向量PB 在 向量PA 的顺时针方向，所以 $\vec{PA} \times \vec{PB}$ 的结果是负数的。那么上面的面积计算公式其实就可以理解为：</p>
<p>三角形ABC的面积 = 三角形PBC面积 + 三角形PCA面积 - 三角形PAB面积</p>
<p>假设这四个点的坐标为：$P(x_0,y_0), A(x_1,y_1), B(x_2,y_2), C(x_3,y_3)$，通过上面的公式进行计算，具体的演算过程我就不给出了，这里直接给出计算结果：<br>$$A = x_1y_2-x_2y_1+x_2y_3-x_3y_2+x_3y_1-x_1y_3$$</p>
<p>我们可以发现，计算结果中没有 $x_0,y_0$ 的项，因为它们在计算过程中给消去了，数学就是这么奇妙！所以我们可以得出一个结论，多边形的面积结果与这个剖分点的位置是无关的。那么为了计算方便，我们当然选择把这个 P 点设置到原点上啦。</p>
<p>那么只要我们知道多边形的每一个顶点，通过原点进行剖分成多个三角形，然后通过向量的叉乘求出每个三角的面积，最后相加，就可以求出多边形的面积了。</p>

## 示例代码及解析

<p>好了，说到这里，我们已经找到所有满足最开始的计算多边形重心点坐标的所有计算元素了。是时候上代码了，这里构建一个函数<code>calculatePolygonGravityCenter(coordinates: [CLLocationCoordinate2D])</code>，这个函数传入的参数是多边形在地图上的坐标点数组。</p>

```swift
func calculatePolygonGravityCenter(coordinates: [CLLocationCoordinate2D]) -> CLLocationCoordinate2D {
    var area = 0.0 // 多边形面积
    var gravityLat = 0.0 // 重心点 latitude
    var gravityLng = 0.0 // 重心点 longitude
    for (index, coordinate) in coordinates.enumerated() {
          // 1
        let lat = coordinate.latitude
        let lng = coordinate.longitude
        let nextLat = coordinates[(index + 1) % coordinates.count].latitude
        let nextLng = coordinates[(index + 1) % coordinates.count].longitude
          // 2
        let tempArea = (nextLat * lng - nextLng * lat) / 2.0
          // 3
        area += tempArea
          // 4
        gravityLat += tempArea * (lat + nextLat) / 3
        gravityLng += tempArea * (lng + nextLng) / 3
    }
      // 5
    gravityLat = gravityLat / area
    gravityLng = gravityLng / area
    
    return CLLocationCoordinate2D(latitude: gravityLat, longitude: gravityLng)
}
```

<p>对应上面代码的注释：</p>
<ol>
<li>拿到多边形上连续两个点的坐标，我们可以把 latitude 看做横坐标，longitude 是纵坐标。</li>
<li>利用向量叉乘计算这两个点与原点组成的三角形的面积。</li>
<li>所有面积之和得出多边形的面积，就是求公式 $C_x = \frac{\sum C_{i_x} A_i}{\sum A_i}$ 中的 $\sum A_i$。</li>
<li><code>(lat + nextLat) / 3</code> 是以这两个点和原点组成的三角形的重心横坐标，这样的累加<code>gravityLat += tempArea * (lat + nextLat) / 3</code> 其实是求公式 $C_x = \frac{\sum C_{i_x} A_i}{\sum A_i}$ 中的 $\sum C_{i_x} A_i$ 的值。</li>
<li>到这一步就简单了，直接套用公式 $C_x = \frac{\sum C_{i_x} A_i}{\sum A_i}$。</li>
</ol>

# 参考资料

<ol>
<li><a href="https://en.wikipedia.org/wiki/Centroid#Centroid_of_polygon" target="_blank" rel="noopener">维基百科-Centroid</a></li>
<li><a href="https://zh.wikipedia.org/wiki/%E5%8F%89%E7%A7%AF" target="_blank" rel="noopener">维基百科-叉积</a></li>
<li><a href="http://www.cnblogs.com/xiexinxinlove/p/3708147.html" target="_blank" rel="noopener">cnblogs-用向量积（叉积）计算三角形的面积和多边形面积</a></li>
<li><a href="https://www.zhihu.com/question/22902370" target="_blank" rel="noopener">知乎-两个向量的叉乘为什么是面积</a></li>
<li><a href="https://kns.cnki.net/KCMS/detail/detail.aspx?dbcode=CFJD&dbname=CJFDLAST2018&filename=SXTB200210014&v=MDk4NThSOGVYMUx1eFlTN0RoMVQzcVRyV00xRnJDVVJMT2ZZK1Z2RmlIblZydk9OalhmYkxHNEh0UE5yNDlFWUk=" target="_blank" rel="noopener">中国知网-任意多边形匀面重心的计算方法</a></li>
</ol>
