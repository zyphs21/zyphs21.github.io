---
title: "PathToGo诞生记"
description: "不知道大家在使用 Mac 的时候有没有这样的需求: 经常需要获取当前文件或者文件夹的路径，并且复制到粘贴板。 对于我来说经常有这种需要，然后我就从网上再结合自己的经验，找了好几种方法："
date: 2018-03-02
updated: 2020-04-17
topics: ["Products / Tools"]
tags: ["开源/产品", "PathToGo", "Products / Tools"]
featured: false
legacyPath: "/2018/03/02/PathToGo 诞生记/"
---
<p>不知道大家在使用 Mac 的时候有没有这样的需求:</p>
<blockquote>
<p>经常需要获取当前文件或者文件夹的路径，并且复制到粘贴板。</p>
</blockquote>
<p>对于我来说经常有这种需要，然后我就从网上再结合自己的经验，找了好几种方法：</p>

<ol>
<li>右键-选择「显示简介」，然后在弹出的窗口里直接用鼠标拖动复制「位    置」里的路径。</li>
</ol>
<p>​    缺点：麻烦。</p>
<ol start="2">
<li>把文件拖到浏览器，在浏览器地址栏复制路径。</li>
</ol>
<p>​    缺点：麻烦。</p>
<ol start="3">
<li>打开终端，把文件拖入终端，终端会把文件路径打印出来，然后复制。</li>
</ol>
<p>​    缺点：麻烦。</p>
<ol start="4">
<li>打开终端，cd到目标目录，然后输入 「pwd|pbcopy」就可以把路径复制到粘贴板。</li>
</ol>
<p>​    缺点：麻烦。</p>
<ol start="5">
<li>选择文件，然后使用快捷键「Option + Command + C」。</li>
</ol>
<p>​    缺点：这个快捷键在更低版本的系统中好像不行，而且会与 Alfred 的一个快捷键冲突。还是麻烦。</p>
<ol start="6">
<li>利用 Automator 来建立 Service 服务添加到右键服务菜单。</li>
</ol>
<p>​    缺点：麻烦。</p>
<p>以上几种方法都不能满足我的需求：</p>
<blockquote>
<ol>
<li>直观快捷</li>
<li>最好可以同时获取多个文件/文件夹的路径。</li>
</ol>
</blockquote>
<p>这时候我想起了很受大家欢迎的一款效率软件：Go2Shell</p>
<p><img src="https://user-gold-cdn.xitu.io/2018/3/2/161e49096986d7c9?w=262&h=238&f=png&s=66436" alt=""></p>
<p>这款软件把它拖动到 Finder 的工具栏后，只要点击它就可以立刻启动终端，并且进入到当前的路径。</p>
<p>那可以不可以也做一款这样的 App 操作和 Go2Shell 类似，选中一个或多个文件或文件夹然后直接一点，就可以把当前选中的文件或文件夹路径复制到粘贴板呢？</p>
<p>然后经过一番折腾，『PathToGo』这款 App 就诞生了。</p>
<p><img src="https://user-gold-cdn.xitu.io/2018/3/2/161e490bc920f193?w=554&h=438&f=png&s=151480" alt=""></p>
<p>虽然一开始是想直接利用 AppleScript 然后导出为应用程序的，可是看着 AppleScript 导出为应用程序的图标实在不够酷，就直接着手做了 PathToGo 这个简单的 Mac App。</p>
<p>下面看看实际体验效果吧：</p>
<p>首先是把『PathToGo』拖动到 Finder 的工具栏，记得是按住『command键』来进行拖动。</p>
<p><img src="https://user-gold-cdn.xitu.io/2018/3/2/161e491134c3825f?w=492&h=214&f=gif&s=199517" alt=""></p>
<p>拖放好了之后，只需要选中你想要的一个或多个文件/文件夹，然后点击在工具栏上的『PathToGo』的图标，路径就已经复制到粘贴板上了，然后你就能愉快的 用 command+v 就能粘贴出你选择的文件的路径了。</p>
<p><img src="https://user-gold-cdn.xitu.io/2018/3/2/161e491402bb99d2?w=668&h=366&f=gif&s=297785" alt=""></p>
<p>怎么样？是不是很方便快捷呢！<br><a href="https://github.com/HansonStudio/PathToGo" target="_blank" rel="noopener">PathToGo</a> 已经开源在 HansonStudio 的 Github 组织下了，大家可以在 Release 页面下载使用。</p>
