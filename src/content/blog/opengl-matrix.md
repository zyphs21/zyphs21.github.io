---
title: "为什么OpenGL里旋转等变换矩阵是4x4的矩阵"
description: "在直观上的认知里，表达一个三维空间的坐标用 x,y,z 就足够了，那在三维空间里进行矩阵变换，用 3x3 的矩阵就够了，为什么需要 4x4 呢？为了回答这个问题，下面我们先在几何意义上理解向量和矩阵之间的关系，然后通过推导旋转矩阵和平移矩阵，一步步来解开这个疑惑。"
date: 2020-10-23
topics: ["Graphics"]
tags: ["OpenGL", "Graphics"]
featured: true
legacyPath: "/2020/10/23/为什么 OpenGL 里旋转等变换矩阵是4x4的矩阵/"
---
<p>OpenGL ES 的很多教程里都会有这样一个例子来讲解纹理：将一张图片作为纹理显示在屏幕上。</p>
<p>因为纹理坐标和实际屏幕显示的坐标不一样，把图片渲染在屏幕上后，图片是上下颠倒的。</p>
<p>一个解决方法是对当前的顶点坐标，乘以绕 z 轴旋转180度的矩阵，这样图片就能正确显示了。</p>
<p>$$<br>\begin{bmatrix}<br>cos\theta &amp; -sin\theta &amp; 0 &amp; 0 \\ sin\theta &amp; cos\theta &amp; 0 &amp; 0 \\ 0 &amp; 0 &amp; 1 &amp; 0 \\ 0 &amp; 0 &amp; 0 &amp; 1 \<br>\end{bmatrix}<br>$$</p>
<p>那么如何理解这个旋转矩阵呢？</p>
<p>影响我们理解这个矩阵的第一个问题是：</p>
<p><strong>为什么这个矩阵是 4x4 的？</strong> 而且我们发现旋转，缩放、平移等变换矩阵都是 4x4 的。</p>
<p>在直观上的认知里，表达一个三维空间的坐标用 x,y,z 就足够了，那在三维空间里进行矩阵变换，用 3x3 的矩阵就够了，为什么需要 4x4 呢？</p>
<p>为了回答这个问题，下面我们先在几何意义上理解<strong><u>向量和矩阵</u></strong>之间的关系，然后通过<strong><u>推导旋转矩阵</u></strong>和<u><strong>平移矩阵</strong></u>，一步步来解开这个疑惑。</p>

## 向量和矩阵

<p>在几何平面上，我们可以把平面上任意一<code>点</code>，当作<u>与原点组成</u>的一个 <code>向量</code> 来理解。</p>
<p>如图 ，A 点可以表示成向量  $\vec{OA}$  ；在 x 轴和 y 轴上各有 i 点（1， 0）和  j 点（0，1），同样的，让它们与原点组成向量，为了简化，我们用  $\vec{i}$  和 $\vec{j}$ 表示这两个向量。</p>
<p><img src="https://cdn.jsdelivr.net/gh/zhenwanping/cdn-assets@master/photo/20201022184245.png" alt="image-20201022184243547"></p>
<p>因为 A 点的坐标为 (3, 2)，如果我们要用  $\vec{i}$  和 $\vec{j}$  表示 $\vec{OA}$ ，那是这样的：<br>$$<br>3\vec{i} + 2\vec{j} = \vec{OA}<br>$$<br>这里的几何意义是 $\vec{i}$ 延展到 $3\vec{i}$  ，$\vec{j}$ 延展到 $2\vec{j}$ ，然后把这两个向量相加即可得到 $\vec{OA}$</p>
<p>i  坐标是 （1， 0），j 坐标是 （0，1），我们把上面这个等式转换成竖列的形式：<br>$$<br>3<br>\begin{bmatrix}1\\0\end{bmatrix}<br>+<br>2<br>\begin{bmatrix}<br>0\\1<br>\end{bmatrix}<br>=<br>\begin{bmatrix}<br>3 \\ 2<br>\end{bmatrix}<br>$$<br>这里其实是向量的简单运算，运算过程如下：<br>$$<br>\begin{bmatrix}<br>3 \times  1 \\ 3 \times 0<br>\end{bmatrix}<br>+<br>\begin{bmatrix}<br>2 \times 0\\2 \times 1<br>\end{bmatrix}<br>=<br>\begin{bmatrix}<br>3 \times 1 + 2 \times 0\\3 \times 0 + 2 \times 1<br>\end{bmatrix}<br>=<br>\begin{bmatrix}<br>3\\2<br>\end{bmatrix}<br>$$<br>看到运算过程是否有种似曾相识的感觉？这不就是矩阵与向量的乘法计算吗？这个运算其实就是将<code>向量左乘一个矩阵</code> 的计算：<br>$$<br>\begin{bmatrix}<br>1 &amp; 0\\0 &amp; 1<br>\end{bmatrix}<br>\begin{bmatrix}<br>3\\2<br>\end{bmatrix}<br>=<br>\begin{bmatrix}<br>3 \times 1 + 2 \times 0 \\3 \times 0 + 2 \times 1<br>\end{bmatrix}<br>=<br>\begin{bmatrix}<br>3 \\ 2<br>\end{bmatrix}<br>$$<br>这里 $\begin{bmatrix} 1 &amp; 0 \\ 0 &amp; 1 \end{bmatrix}$  其实就是<code>单元矩阵</code>，左乘一个单元矩阵并不会改变原来的值。而这个单元矩阵以两个竖列来看，<strong>正是 i 和 j 点的坐标</strong>，也是向量  $\vec{i}$  和  $\vec{j}$ ，在数学上将  $\vec{i}$  和  $\vec{j}$  称为此坐标系的 <code>基向量</code>。</p>

## 推导旋转矩阵

<p>我们现在把整个坐标轴绕原点逆时针旋转  $45^o$ ：</p>
<p><img src="https://cdn.jsdelivr.net/gh/zhenwanping/cdn-assets@master/photo/20201022220658.png" alt="image-20201022220656758"></p>
<p>旋转后  i 点和 j 点对应  $i^\prime$  和  $j^\prime$ 位置。</p>
<p>通过简单的三角函数计算得到： $i^\prime$ 坐标为 $\begin{bmatrix}cos45^o \\ sin45^o\end{bmatrix}$ ，$j^\prime$ 坐标为 $\begin{bmatrix} -sin45^o \\ cons45^o \end{bmatrix}$</p>
<p>旋转后，A 点的坐标是多少呢？回顾上面的做法， $\vec{i^\prime}$ 延展到 $3\vec{i^\prime}$  ，$\vec{j^\prime}$ 延展到 $2\vec{j^\prime}$ ，然后把这两个向量相加即可得到 $\vec{OA^\prime}$ 。结合上面一节矩阵和向量的推演，可以变成下面的形式：<br>$$<br>\begin{bmatrix}<br>cos45^o &amp; -sin45^o \\sin45^o &amp; cos45^o<br>\end{bmatrix}<br>\begin{bmatrix}<br>3 \\ 2<br>\end{bmatrix}<br>$$<br>我们发现，左边的矩阵不正是开头所看到的 <code>旋转矩阵</code> 吗？只不过这是二维平面上的旋转矩阵:<br>$$<br>\begin{bmatrix}<br>cos\theta &amp; -sin\theta \\sin\theta &amp; cos\theta<br>\end{bmatrix}<br>$$<br>结合图形和计算，我们可以这样理解这个二维矩阵：二维矩阵代表一个坐标系里的两个基向量，而在这个坐标系里的点与原点组成的向量，都可以用这两个基向量的变换来表示。那么旋转一个点，可以转换成旋转这个点所在的坐标系，从而通过变化的基向量求出旋转后的点的位置。</p>
<p>其实这种变换在数学上称作 <code>线性变换</code> ，线性变换是通过 <code>矩阵乘法</code> 来实现</p>
<blockquote>
<p><strong>线性变换</strong>：是在两个<a href="https://zh.wikipedia.org/wiki/向量空间" target="_blank" rel="noopener">向量空间</a>（包括由函数构成的抽象的向量空间）之间的一种保持向量加法和标量乘法的特殊映射</p>
</blockquote>
<blockquote>
<p>线性变换在几何直观上有如下特点：</p>
<ul>
<li><p>变换前后，直线仍然保持是直线的状态</p>
</li>
<li><p>变换前后，原点保持固定，不会变化</p>
</li>
</ul>
</blockquote>
<p>我们从二维平面，推导到三维坐标也是同理，只不过是多了个 z 轴<br>$$<br>\begin{bmatrix}<br>1 &amp; 0 &amp; 0 \\0 &amp; 1 &amp; 0 \\0 &amp; 0 &amp; 1<br>\end{bmatrix}<br>$$<br>竖着来看这个矩阵，是 x，y，z轴上的三个基向量，同时它又是一个单元矩阵。</p>
<p>同理上面二维平面的推导，三维坐标绕 z 轴的旋转矩阵为：<br>$$<br>\begin{bmatrix}<br>cos\theta&amp;-sin\theta&amp;0\\sin\theta&amp;cos\theta&amp;0\\0&amp;0&amp;1<br>\end{bmatrix}<br>$$</p>

## 推导平移矩阵

<p>那么平移操作，能不能也用这种矩阵与向量相乘的形式呢？我们再次回到二维平面，看看将 A 点平移到 B 点的情况是怎样的。</p>
<img src="https://cdn.jsdelivr.net/gh/zhenwanping/cdn-assets@master/photo/20201022222202.png" alt="image-20201022222139291" style="zoom: 33%;" />

<p>要将 A 点（3，2）平移到 B 点(4，5)，实际上就是先将 A 点往右移动 1 ，再往上移动 3，即 x 坐标值增加 1，y坐标值增加 3<br>$$<br>\begin{bmatrix}<br>x + 1 \\ y + 3<br>\end{bmatrix}<br>=<br>\begin{bmatrix}<br>x \\ y<br>\end{bmatrix}<br>+<br>\begin{bmatrix}<br>1 \\ 3<br>\end{bmatrix}<br>=<br>\begin{bmatrix}<br>3 + 1 \\ 2 + 3<br>\end{bmatrix}<br>=<br>\begin{bmatrix}<br>4 \\ 5<br>\end{bmatrix}<br>$$<br>从上面的运算来看，平移这种操作实际上是 <code>向量的加法</code>，即:<br>$$<br>\vec{OA} + \vec{OC} = \vec{OB}<br>$$</p>
<p>$$<br>\begin{bmatrix} 3 \\ 2 \end{bmatrix} + \begin{bmatrix} 1 \\ 3 \end{bmatrix}=\begin{bmatrix} 4 \\ 5 \end{bmatrix}<br>$$</p>
<p>我们可以通过向量加法的 <code>平行四边形法则</code> 加深理解，如下图：</p>
<img src="https://cdn.jsdelivr.net/gh/zhenwanping/cdn-assets@master/photo/20201022223037.png" alt="image-20201022223035113" style="zoom:50%;" />

<p>对于平移这种操作，<strong>我们无法仅仅通过矩阵乘法来实现</strong>。</p>
<p>而实际上，平移这种操作属于 <code>仿射变换</code> 。</p>
<blockquote>
<p><strong>仿射变换</strong>，又称<strong>仿射映射</strong>，是指在几何中，对一个向量空间进行一次<a href="https://zh.wikipedia.org/wiki/线性变换" target="_blank" rel="noopener">线性变换</a>并接上一个平移，变换为另一个向量空间。</p>
</blockquote>
<p>仿射变换在几何直观上，相比线性变换，它不需要保证变换前后坐标原点不变。</p>
<p>如下图，从 A 点平移到 B 点，我们换一个角度思考，这次不移动点，而是<code>移动整个坐标轴</code>，同样可以达到平移 A 点到 B 点的需求，但是坐标原点移动到了 O’ 点（1，3）。</p>
<img src="https://cdn.jsdelivr.net/gh/zhenwanping/cdn-assets@master/photo/20201022230510.png" alt="image-20201022230432040" style="zoom: 33%;" />

<p>我们希望构造的是像下面这种矩阵乘法的等式，这样才能用一个通用的计算模式来处理坐标点的变换。<br>$$<br>\begin{bmatrix}<br>矩阵<br>\end{bmatrix}<br>\begin{bmatrix}<br>3\\2<br>\end{bmatrix}<br>=<br>\begin{bmatrix}<br>4\\5<br>\end{bmatrix}<br>$$<br>到这里，我们终于要请出 <code>齐次坐标</code> 了。</p>
<blockquote>
<p>齐次坐标就是将一个原本是 n 维的向量用一个 n+1 维向量来表示，是指一个用于投影几何里的坐标系统，如同用于欧氏几何里的笛卡儿坐标一般。</p>
</blockquote>
<p>用一个通俗的讲法是，我们需要 <code>升维</code> 来处理这个问题。</p>
<blockquote>
<p>通过增加一个维度，我们可以在<code>高维度</code>上，通过线性变换来处理<code>低维度</code>的仿射变换。</p>
</blockquote>
<p>这句话咋一听感觉很有哲理，但是通过下面的数学等式就能知道其中的奥妙：<br>$$<br>\begin{bmatrix}<br>1 &amp; 0 &amp; 1 \\0 &amp; 1 &amp; 3 \\0 &amp; 0 &amp; 1<br>\end{bmatrix}<br>\begin{bmatrix}<br>3 \\ 2 \\ 1<br>\end{bmatrix}<br>=<br>\begin{bmatrix}<br>1 \times 3 + 0 \times 2 + 1 \times 1 \\0 \times 3 + 1 \times 2 + 3 \times 1 \\0 \times 3 + 0 \times 2 + 1 \times 1<br>\end{bmatrix}<br>=<br>\begin{bmatrix}<br>4 \\ 5 \\ 1<br>\end{bmatrix}<br>$$<br>观察上面的运算过程，结果 $\begin{bmatrix}4\\5\\1 \end{bmatrix}$ 不正是我们上面所得的 $\begin{bmatrix} 4\\5 \end{bmatrix}$ 吗？只不过多了一个 z 轴的坐标值。</p>
<p>我们通过升级一个维度，将在二维平面上的平移问题转换成了在三维坐标的矩阵和向量乘法。那么在二维平面上，这个平移矩阵就为：<br>$$<br>\begin{bmatrix}<br>1 &amp; 0 &amp; tx \\0 &amp; 1 &amp; ty \\0 &amp; 0 &amp; 1<br>\end{bmatrix}<br>$$<br>tx 和 ty 就对应在 x 轴 和 y 轴上的移动距离。</p>
<p>同理推广到三维坐标系，要实现三维坐标的平移操作，同样需要通过升维，引入齐次坐标来计算。那么三维坐标下的平移矩阵就为：<br>$$<br>\begin{bmatrix}<br>1 &amp; 0 &amp; 0 &amp; tx \\0 &amp; 1 &amp; 0 &amp; ty \\0 &amp; 0 &amp; 1 &amp; tz \\0 &amp; 0 &amp; 0 &amp; 1 \<br>\end{bmatrix}<br>$$</p>

## 总结

<p>至此，我们可以回答最开始的问题了，为什么 OpenGL 里的矩阵变换是 4x4 的矩阵呢？</p>
<p>我们来想象这样一个场景：如果我要让顶点坐标旋转一定角度后，再平移一段距离，那么这里面的操作就涉及 3x3 矩阵的计算和 4x4 矩阵的计算，如果不统一起来，这种连续变换的计算操作将很复杂。</p>
<p>所以如果要用矩阵乘法来统一所有的平移、旋转等等变换计算，为了照顾到平移这类仿射变换，统一用 4x4 矩阵来计算既能满足场景又方便计算。</p>
