---
title: "如何判断一个多边形是否合法"
description: "利用无人机对一片区域进行测绘前，我们会先在地图上框选一个区域，然后再规划飞行的路线，而需要测绘的这片区域往往是一个多边形。这就涉及判断多边形是否合法的问题。 首先我们要确定一个标准：怎么样才算一个不合法的多边形 ？我们可以简单地通过下面这幅图来解释一下："
date: 2019-02-17
updated: 2020-06-25
topics: ["Geometry / Algorithms"]
tags: ["算法实践", "Geometry", "Geometry / Algorithms"]
featured: false
legacyPath: "/2019/02/17/如何判断一个多边形是否合法/"
---
<p>利用无人机对一片区域进行测绘前，我们会先在地图上框选一个区域，然后再规划飞行的路线，而需要测绘的这片区域往往是一个多边形。这就涉及判断多边形是否合法的问题。</p>
<p>首先我们要确定一个标准：<strong>怎么样才算一个不合法的多边形</strong> ？我们可以简单地通过下面这幅图来解释一下：<br><img src="https://cdn.jsdelivr.net/gh/zyphs21/cdn-assets/photo/judgePolygonValid/polygonDesc.png" alt=""></p>

<p>我们可以看出前面两个分别是凹多边形和凸多边形，而最后一张则是我们所说的不合法多边形，可以看出这个不合法的多边形的特征就是：<strong>它存在某条边与另外一条边相交的情况</strong> 。</p>
<p>那么要判断一个多边形是否合法，我们只要判断组成多边形的所有线段是否存在相交的情况即可，当然，我们这里所说的相交是 <strong>规范相交</strong> ，即 <strong>交点不在线段的端点上</strong> 。</p>
<p>好了，那么现在的问题可以简化成：<strong>如何判断两条线段是否规范相交</strong> 。</p>
<p>这里我们需要借助 <strong>向量的叉积</strong> 来进行判断。</p>
<blockquote>
<p>叉积，又称向量积，是对三维空间中的两个向量的二元运算。</p>
</blockquote>
<p>这里推荐 3Blue1Brown 的 <a href="https://www.bilibili.com/video/av6731067/?p=11" target="_blank" rel="noopener">视频</a> 来快速回顾一下叉积的概念(下面的两幅截图来自此视频)。我们只需知道叉积的结果是有正负的，比如我们以向量 $\vec{v}$ 为标准，如下图，向量  $\vec{w}$  在  $\vec{v}$ 的 <strong>顺时针方向</strong>，那么   $\vec{v} \times \vec{w} &lt; 0$ ：</p>
<p><img src="https://cdn.jsdelivr.net/gh/zyphs21/cdn-assets/photo/judgePolygonValid/vetorvw.png" alt=""><br>$$\vec{v} \times \vec{w} &lt; 0$$</p>
<p>如果向量 $\vec{w}$  在  $\vec{v}$ 的 <strong>逆时针方向</strong>，那么 $\vec{v} \times \vec{w} &gt; 0$ ：</p>
<p><img src="https://cdn.jsdelivr.net/gh/zyphs21/cdn-assets/photo/judgePolygonValid/vetorwv.png" alt=""><br>$$\vec{v} \times \vec{w} &gt; 0$$</p>
<p>那么我们如何利用叉积的特性运用到判断线段是否相交上呢？</p>
<p>我们先看下面最直接的一个线段相交的情况：<br><img src="https://cdn.jsdelivr.net/gh/zyphs21/cdn-assets/photo/judgePolygonValid/line1.png" alt=""></p>
<p>线段 $P_1P_2$ 和 线段 $Q_1Q_2$ 明显存在一个交点，从上面这张图我们可以做一个简单的结论：<strong>如果一条的线段的两个端点在另外一条线段两侧，那么这两条线段可能相交</strong>，注意这里说的是可能相交，稍后会讲到另外一种情况。</p>
<p>我们可以将上面的图转换为向量的情况来看：<br><img src="https://cdn.jsdelivr.net/gh/zyphs21/cdn-assets/photo/judgePolygonValid/line2.png" alt=""></p>
<p>是不是觉得似曾相识，这跟上面提到的叉积的情况是不是很类似？<br>向量  $\vec{P_1Q_1}$  在  $\vec{P_1P_2}$ 的逆时针方向，那么：$\vec{P_1P_2} \times \vec{P_1Q_1} &gt; 0$<br>向量  $\vec{P_1Q_2}$  在  $\vec{P_1P_2}$ 的顺时针方向，那么：$\vec{P_1P_2} \times \vec{P_1Q_2} &lt; 0$</p>
<p>用 A 表示 $\vec{P_1P_2} \times \vec{P_1Q_1} $ 的叉积结果，用 B 表示 $\vec{P_1P_2} \times \vec{P_1Q_2}$ 的叉积结果，那么 <strong>一条的线段的两个端点在另外一条线段两侧</strong> 这个几何现象可以用这个公式表示 ：A*B &lt; 0</p>
<p>我们前面提到 <strong>如果一条的线段的两个端点在另外一条线段两侧，那么这两条线段可能相交</strong> ，为什么是可能相交呢？如果我们将 线段 $Q_1Q_2$ 往右边移动一下，会存在下面这种情况：<br><img src="https://cdn.jsdelivr.net/gh/zyphs21/cdn-assets/photo/judgePolygonValid/line3.png" alt=""><br>从上图可以看出，线段 $Q_1Q_2$ 的两个端点在线段 $P_1P_2$  两侧，但是它们并没有相交。</p>
<p>那么如何排除这种情况呢？其实很简单，我们之前都是以线段 $P_1P_2$ 作为主视角，如果将主视角换成线段 $Q_1Q_2$，那么我们很容易看出 线段 $P_1P_2$ 的两个端点并没有在 线段 $Q_1Q_2$ 的两侧。所以我们再次看回上面相交的那幅图，为了能够充分的判断两条线段相交，这次以 $Q_1Q_2$ 为主视角看待这个问题，求叉积：<br><img src="https://cdn.jsdelivr.net/gh/zyphs21/cdn-assets/photo/judgePolygonValid/line4.png" alt=""><br>向量  $\vec{Q_1P_2}$  在  $\vec{Q_1Q_2}$ 的逆时针方向，那么：$\vec{Q_1Q_2} \times \vec{Q_1P_2} &gt; 0$<br>向量  $\vec{Q_1P_1}$  在  $\vec{Q_1Q_2}$ 的顺时针方向，那么：$\vec{Q_1Q_2} \times \vec{Q_1P_1} &lt; 0$</p>
<p>综上，我们可以得出：<br>A =  $\vec{P_1P_2} \times \vec{P_1Q_1} $<br>B = $\vec{P_1P_2} \times \vec{P_1Q_2} $<br>C = $\vec{Q_1Q_2} \times \vec{Q_1P_1} $<br>D = $\vec{Q_1Q_2} \times \vec{Q_1P_2} $<br>当 A * B &lt; 0 &amp;&amp; C * D &lt; 0 的时候，两条线段规范相交。<br>至于向量的叉积如何运算，这里就不细写了，给出一张计算草稿给大家过目一下：<br><img src="https://cdn.jsdelivr.net/gh/zyphs21/cdn-assets/photo/judgePolygonValid/calcraft.png" alt=""><br>根据计算草稿的内容，我们就很容易通过代码来实现了：</p>

```text
private func isIntersect(line1: (CGPoint, CGPoint), line2: (CGPoint, CGPoint)) -> Bool {
        let p1 = line1.0
        let p2 = line1.1
        let q1 = line2.0
        let q2 = line2.1

        let a1 = (p2.x - p1.x) * (q1.y - p1.y) - (q1.x - p1.x) * (p2.y - p1.y)
        let a2 = (p2.x - p1.x) * (q2.y - p1.y) - (q2.x - p1.x) * (p2.y - p1.y)
        
        let b1 = (q2.x - q1.x) * (p1.y - q1.y) - (p1.x - q1.x) * (q2.y - q1.y)
        let b2 = (q2.x - q1.x) * (p2.y - q1.y) - (p2.x - q1.x) * (q2.y - q1.y)
        
        if a1 * a2 < 0 && b1 * b2 < 0 {
            return true
        }
        return false
}
```

<p>由于笔者能力有限，文中如有错误还请各位读者不吝赐教。</p>
<br>
<br>
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
