---
title: "使用SVN建立和发布私有CocoaPods库"
description: "现在应该没有人用 SVN 了吧"
date: 2018-03-28
updated: 2020-04-17
topics: ["Products / Tools"]
tags: ["工具教程", "CocoaPods", "Products / Tools"]
featured: false
legacyPath: "/2018/03/28/使用 SVN 建立和发布私有 CocoaPods 库/"
---
## SVN 项目结构

<p>首先，一般 SVN 项目有如下的结构：</p>
<ul>
<li>trunk：项目主干</li>
<li>branches：开发或者 Bug 分支</li>
<li>tags：发布的版本</li>
</ul>
<p>比如说我们已经写好了一个 CocoaPods 的库，它的名字是 xxxKit，那么它应该在看起来是这样的：<br></p>

## 建立 CocoaPods 库

<p>我们在 trunk 的目录下执行 </p>
<p><code>pod lib create xxxKit</code></p>
<p>按照提示输入后，在该目录下就会利用 CocoaPods 的模板生成了一个项目。我们主要关注<code>xxxKit.podspec</code> 这个文件。</p>
<p>修改 <code>xxxKit.podspec</code>，比如：   </p>

```text
Pod::Spec.new do |s|
  s.name         = "xxxKit"
  s.version      = "0.1.1"
  s.summary      = "xxxKit."
  s.homepage     = "https://github.com/zyphs21/"
  s.author       = { "zyphs21" => "hansenhs21@live.com" }
  s.source       = { :svn => "http://xxxx/xxxKit/", :tag => s.version.to_s }
  s.source_files  = "xxxKit/**/*.{swift}"
end
```

<p>主要注意是指定 source 那里，路径填的是 SVN 仓库的地址，并加上 tag。</p>
<p><code>s.source = { :svn =&gt; &quot;http://xxxx/xxxKit/&quot;, :tag =&gt; s.version.to_s }</code></p>

## 打 tags 发布一个版本

<p>这里以 <code>Cornerstone</code> 这个 Mac 端的 SVN 工具来说明。</p>
<ol>
<li><p>去到远程库里进行打 tags，注意只有在远程库操作才能打 tag。</p>

</li>
<li><p>选择在 trunk 主干上 <code>右键</code> -&gt; <code>Tag…</code>，然后输入 tag 标签，比如 v0.1.1</p>

</li>
</ol>
<p>之后只要有开发到了新的版本了，按照这样先打 tag。</p>

## 使用私有库

<p>去到需要使用该库的项目里，在 Podfile 里指定该版本：</p>

```text
pod 'xxxKit', :svn => 'http://xxxx/xxxKit/', :tag => '0.1.1'
```

<p>然后执行 <code>pod install</code></p>
