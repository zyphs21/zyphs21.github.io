---
title: "PathToGo “没什么卵用” 的更新"
description: "PathToGo 是一个可以复制当前选中文件的路径到粘贴板的小 Mac App。具体可以看看之前写的文章 《PathToGo诞生记》 。"
date: 2020-06-28
updated: 2020-06-25
topics: ["Products / Tools"]
tags: ["开源/产品", "PathToGo", "Products / Tools"]
featured: false
legacyPath: "/2020/06/28/PathToGo 没什么卵用的更新/"
---
<p>PathToGo 是一个可以复制当前选中文件的路径到粘贴板的小 Mac App。具体可以看看之前写的文章 <a href="">《PathToGo诞生记》</a> 。</p>

### 用户反馈

<p>PathToGo 解决的是一个很冷门的需求，即便是我，也不会经常用它。甚至很多人觉得它 <code>“没有什么卵用”</code>。但是它仍然收获了一部分用户，甚至还收到用户的反馈：</p>
<p><img src="https://imgkr.cn-bj.ufileos.com/ccdab9e6-bae4-4fa5-9f4c-a245b16894e7.png" alt=""></p>
<p>这个用户的需求是希望复制出来的文件路径可以带上 <code>反斜杠转义符</code>，这样他可以直接复制到他的终端里跳转路径使用。</p>
<p>很明显，这个用户并不知道 <code>Go2Shell</code> ，这款给了 <code>PathToGo</code> 诞生灵感的 App。如果他使用 <code>Go2Shell</code>  的话应该能够很好地解决他真正的需求。</p>

### 我的吐槽

<p>Anyway，既然有用户反馈，我有了一点点更新它的动力。不过最大的动力还是来自于我对 <code>PathToGo</code> 的不满：<strong>它实在太丑了！</strong></p>
<p>因为 <code>PathToGo</code> 的使用场景，注定它要常驻在 Finder 的 Toolbar 上。而当初在设计图标的时候，脑抽地给它设置了一个<strong>半透明背景</strong> 😂。在 macOS 的浅色模式下还好，但是在深色模式下的样子真的一言难尽：</p>
<p><img src="https://imgkr.cn-bj.ufileos.com/a416976a-2092-4f0c-801a-057cbfc20a4a.png" alt="浅色模式下显示"></p>
<p><img src="https://imgkr.cn-bj.ufileos.com/62b41f1b-cbf7-4cce-9b06-0863befd9df6.png" alt="深色模式下显示"></p>
<p>如上图，真的太丑了！而且图标的大小与 Toolbar 上的其它 icon 相比显得是如此的格格不入。</p>

### 重新设计图标

<p>所以，更新 PathToGo 的首要任务是重新设计图标！</p>
<p>设计不是我的长项，所以我给自己订的只有两个要求：</p>
<ol>
<li>改掉背景色 </li>
<li>图标尺寸在 Finder 上不要显得那么突兀</li>
</ol>
<p>打开 Sketch，一顿操作后，PathToGo 的图标现在长这样了：</p>
<p><img src="https://imgkr.cn-bj.ufileos.com/8459c5a7-cd62-4bf6-a9d9-a32766274a5c.png" alt="PathToGo图标"></p>
<p>然后它在 Finder 上是这样子的：</p>
<p><img src="https://imgkr.cn-bj.ufileos.com/9fd7a8c4-f2ad-4cf5-8587-f139480f978e.png" alt=""></p>
<p>嗯嗯，看着还可以。</p>
<p>不过还能更进一步吗？能在好看的同时又能够满足上面用户反馈的需求吗？</p>
<p>这时候，我发现了一个东西：<strong><a href="https://developer.apple.com/library/archive/documentation/General/Conceptual/ExtensibilityPG/Finder.html" target="_blank" rel="noopener">FinderSync</a></strong></p>

### 用 FinderSync 改造

<p>FinderSync 是苹果提供的一个扩展功能，它的目的是可以让开发者自定义 Finder 文件的界面，以提示用户文件的监听使用状态等。比如你的 App 可以进行文件同步的功能，你希望让用户知道当前文件是否已经同步完成了，可以通过 FinderSync 这个扩展来给文件添加 icon 以达到提示的作用：</p>
<p><img src="https://imgkr.cn-bj.ufileos.com/f2ad6a3f-ef5c-4c0d-9ec6-5f78b9774ea3.png" alt=""></p>
<p>我注意到 FinderSync 可以给 Finder 添加一个原生的 Toolbar！如果 PathToGo 可以做成一个原生样式的 Toolbar 按钮，那不就太完美了吗？</p>
<p>不过 FinderSync 只支持有下拉选项的 Toolbar 按钮样式，那其实可以将上面用户反馈的功能做到这里：</p>
<p>点击下拉出两个选项，一个是复制纯文本，一个是复制出带有反斜杠转义的文本。</p>
<p>这样就既能保留 PathToGo 原有的功能基础上，扩展出了新的功能，尽管与 PathToGo <code>一点击即达</code> 的初衷有点违背，但是我认为这是<strong>在权衡好看和功能性两者之间的最好妥协</strong>。</p>
<p>于是，PathToGo 在支持原来拖动放置在 Finder Toolbar 的形式的基础上，多了一种以 FinderSync 为踏板的新形式，<strong>终于让它很好地融入了 Toolbar 上</strong>：</p>
<p><img src="https://imgkr.cn-bj.ufileos.com/51709307-f8e5-4715-90a8-a1eea46296ba.png" alt="PathToGo 在 Finder Toolbar 上"></p>
<p>添加的方式是：右击 Finder Toolbar 空白处，进入自定义 Toolbar，找到 PathToGo 并拖动添加到 Toolbar 上就可以啦！</p>
<p><img src="https://imgkr.cn-bj.ufileos.com/464ba02e-a880-425c-8da3-9032d820fd1e.png" alt=""></p>

### 最后

<p>尽管在很多人看来 PathToGo 还是一个没什么卵用的东西，但是这次从出现更新的念头，到最后利用 FinderSync “曲线救国”的实现过程，我是觉得很有意思的。</p>
<blockquote>
<p>PathToGo 下载地址：<code>https://github.com/HansonStudio/PathToGo/releases</code></p>
</blockquote>
<blockquote>
<p>欢迎关注我的公众号：HansonTalk<br><img src="https://cdn.jsdelivr.net/gh/zyphs21/cdn-assets/qrcode/HansonTalk.jpg" alt=""></p>
</blockquote>
