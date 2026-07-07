---
title: "通过 DeveloperID证书分发 Mac App 的经验"
description: "对 Mac App 打包后，我们可以选择通过 Developer ID 方式直接向我们的客户分发 Mac App 而不用将 App 传到 Mac App Store。 在这个过程中遇到了一些坑，故总结分享一下。"
date: 2020-06-12
updated: 2020-06-25
topics: ["Swift / iOS"]
tags: ["iOS开发", "macOS", "Swift / iOS"]
featured: true
legacyPath: "/2020/06/12/通过 DeveloperID 证书分发 Mac App 的经验/"
---
<p>对 Mac App 打包后，我们可以选择通过 <code>Developer ID</code> 方式直接向我们的客户分发 Mac App 而不用将 App 传到 Mac App Store。</p>
<p><img src="https://imgkr.cn-bj.ufileos.com/e0d7c2cf-f9a7-4f3c-8351-282e3ac12094.png" alt=""></p>
<p>在这个过程中遇到了一些坑，故总结分享一下。</p>

## Developer ID 证书

#### 创建

<p>首先我们需要创建 Developer ID 证书，具体如何创建可以看苹果的这个 <a href="https://help.apple.com/developer-account/#/dev04fd06d56" target="_blank" rel="noopener">文档: 创建 Developer ID 证书</a>。</p>
<p>但是这里有个需要很注意的问题：使用开发者帐户或 Xcode 可以创建 <code>最多五个</code> Developer ID App 证书。</p>

#### 撤销

<p>撤销删除 Developer ID App 证书 并不是随意操作的，不管你的苹果开发者账号的角色是什么，需通过 <code>product-security@apple.com</code> 向 Apple 发送请求，才可以删除。</p>
<p>而且注意，<strong>如果您撤销了 Developer ID 证书，用户便无法安装使用该证书签名的 app。</strong></p>
<blockquote>
<p>更详细的撤销证书权限可以看这个 <a href="https://help.apple.com/developer-account/#/dev138c9fac7" target="_blank" rel="noopener">文档: 撤销权限</a></p>
</blockquote>
<p>所以这里需要注意保管好 Developer ID 证书的私钥。我就试过换了电脑后，本地证书没有私钥的尴尬情况，就是常见的 <code>Missing Private key</code> 错误，如果你的 Developer ID 证书数量刚好达到了上限，无法创建新的证书，又丢失了旧的证书的私钥的话，这个情况就只能通过 <code>product-security@apple.com</code> 向 Apple 发送请求撤销旧的证书，再创建新的了。所以这里建议可以事先在 KeyChain Access.app 里导出 p12 文件做好保管。</p>

## Notarization 苹果公证

<p>从 <code>macOS 10.14.5</code> 之后，通过 Developer ID 证书分发的 App，苹果建议都需要通过苹果的公证(Notarized)，以代表这个 App 不含有恶意内容，否则的话每次用户初次打开你的 App 的时候都会有 <code>无法检查是否包含恶意软件</code> 的安全提示，类似如下图：</p>
<p><img src="https://imgkr.cn-bj.ufileos.com/c7fb34a3-d41d-4003-beb8-3bc2ba3061da.png" alt=""></p>
<p>这时候需要去到系统设置的安全与隐私那里，选择仍要打开：</p>
<p><img src="https://imgkr.cn-bj.ufileos.com/3ac18848-7e5e-4ea5-b942-64c9b54efad7.png" alt=""></p>
<p>这时候还会有个安全提示，但是这次是有 <code>打开</code> 选项的：</p>
<p><img src="https://imgkr.cn-bj.ufileos.com/9cb935ba-b1d0-417b-9a28-318bfd5459f4.png" alt=""></p>
<p>这一顿操作下来其实对用户的体验很不友好，让人产生对 App 的不信任感。</p>
<p>所以这里还是建议大家把 App 上传给苹果进行公证。如下图在打包的时候可以选择 <code>Upload</code> 给苹果进行 Notarize</p>
<p><img src="https://imgkr.cn-bj.ufileos.com/15ed1b9d-485e-4c5a-90ed-66a329d5d246.png" alt=""></p>
<blockquote>
<p>关于 Notarization 这块更详细的内容，可以查看这个 <a href="https://developer.apple.com/documentation/xcode/notarizing_macos_software_before_distribution" target="_blank" rel="noopener">文档: Notarizing macOS Software Before Distribution</a></p>
</blockquote>
<blockquote>
<p>欢迎关注我的个人公众号：HansonTalk，分享点有意思的。<br><img src="https://cdn.jsdelivr.net/gh/zyphs21/cdn-assets/qrcode/HansonTalk.jpg" alt=""></p>
</blockquote>
