---
title: "用SwiftGen管理UIImage等的String-based接口"
description: "如何减少因为拼写错误导致的问题？"
date: 2017-12-08
updated: 2020-04-17
topics: ["Swift / iOS"]
tags: ["iOS开发", "Swift", "Swift / iOS"]
featured: false
legacyPath: "/2017/12/08/用SwiftGen管理UIImage等的String-based接口/"
---
# 问题现状

<p>平时我们使用UIImage，UIFont，UIColor会遇到很多String-based的接口方法，比如常用的UIImage：</p>

```swift
let testImage = UIImage(named: "test")
```

<p>对于上面的代码，如果我们把 <code>test</code> 拼写错了，Xcode 并不会给出提示，只有当我们运行的时候才会收到报错，这样维护起来是有一定成本的。</p>

# 代码解决

<p>我们可以用类似如下的代码来解决这个问题：</p>

```swift
import UIKit.UIImage

struct ImageAssets {
    fileprivate var name: String
    var image: UIImage {
        let image = UIImage(named: name)
        guard let result = image else { fatalError("Unable to load image named \(name).") }
        return result
    }
}
enum Assets {
    enum AppLogo {
        static let appLogo = ImageAssets(name: "appLogo")
        static let grayLogo = ImageAssets(name: "gray_logo")
    }
    enum Arrow {
        static let arrowBlue = ImageAssets(name: "arrow_blue")
        static let arrowBrown = ImageAssets(name: "arrow_brown")
    }
    // ....
}
extension UIImage {
    convenience init!(asset: ImageAssets) {
        self.init(named: asset.name)
    }
}
```

<p>利用上面的代码，我们在新建 UIImage 的时候就不需要去想图片的名字了，而且 Xcode 还会有代码提示：</p>

```swift
let logo = Asset.AppLogo.appLogo.image
let grayLogo = UIImage(asset: Asset.AppLogo.grayLogo)
```

# 存在问题

<p>虽然这种方法在调用的时候简单又安全了，但是项目中的图片往往比较多，如果手动编写维护那段代码也是需要不少精力，而且不能保证后续不会添加新的图片，这样每次都要去维护那段代码不免有些反人类。<br>那么现在就要介绍这个开源项目—  <a href="https://github.com/SwiftGen/SwiftGen" target="_blank" rel="noopener"><code>SwiftGen</code></a>了！</p>
<blockquote>
<p>SwiftGen is a tool to auto-generate Swift code for resources of your projects, to make them type-safe to use.</p>
</blockquote>
<p>利用 SwiftGen 可以帮我们生成这类的代码，但是 SwiftGen 默认生成的代码样式有时候并不是我们想要的，而且默认生成还会有针对 macOS 上的代码，比较好的是 SwiftGen 提供了模板的功能，我们可以按自己的需要来修改模板。</p>

# 集成 SwiftGen 在项目中

<p>SwiftGen 提供了好几种的集成方式，我这里只介绍我自己比较喜欢的方式：就是通过下载它的 Zip 文件解压到项目的目录中，然后通过添加 Run Script 来进行管理。这样可以基本做到不用操心代码。</p>

## 1.修改模板

<ul>
<li><p>到 SwiftGen仓库的Release页面下载最新的 <a href="https://github.com/SwiftGen/SwiftGen/releases" target="_blank" rel="noopener">swiftgen-5.2.1.zip</a></p>
</li>
<li><p>将解压后的 <code>swiftgen-5.2.1</code> 文件夹放到项目所在的目录下(存放<code>xxx.xcodeproj</code> 的位置)，可以将文件夹的名字改为<code>SwiftGen5</code>简洁一点。</p>
</li>
<li><p>进入到 <code>SwiftGen5</code> 里的 <code>templates/xcassets</code> 目录下，这里面可以看到有不少模板，我们选择 <code>swift4.stencil</code> 复制一份，命名为 <code>my-swift4.stencil</code> 然后我们就可以在里面修改我们自己想要的模板，我主要是想把 macOS 等其它平台的一些判断代码给删掉:</p>

```swift
// Generated using SwiftGen, using my-templete created by Hanson

{% if catalogs %}
{% set imageAlias %}{{param.imageAliasName|default:"Image"}}{% endset %}
import UIKit.UIImage

typealias {{imageAlias}} = UIImage

{% set enumName %}{{param.enumName|default:"Asset"}}{% endset %}
{% set imageType %}{{param.imageTypeName|default:"ImageAsset"}}{% endset %}
@available(*, deprecated, renamed: "{{imageType}}")
typealias {{enumName}}Type = {{imageType}}

struct {{imageType}} {
fileprivate var name: String

var image: {{imageAlias}} {
let bundle = Bundle(for: BundleToken.self)
let image = {{imageAlias}}(named: name, in: bundle, compatibleWith: nil)
guard let result = image else { fatalError("Unable to load image named \(name).") }
return result
}
}
{% macro enumBlock assets sp %}
{{sp}}  {% call casesBlock assets sp %}
{{sp}}  {% if not param.noAllValues %}
{{sp}}  {% endif %}
{% endmacro %}
{% macro casesBlock assets sp %}
{{sp}}  {% for asset in assets %}
{{sp}}  {% if asset.type == "color" %}
{{sp}}  static let {{asset.name|swiftIdentifier:"pretty"|lowerFirstWord|escapeReservedKeywords}} = {{colorType}}(name: "{{asset.value}}")
{{sp}}  {% elif asset.type == "image" %}
{{sp}}  static let {{asset.name|swiftIdentifier:"pretty"|lowerFirstWord|escapeReservedKeywords}} = {{imageType}}(name: "{{asset.value}}")
{{sp}}  {% elif asset.items %}
{{sp}}  enum {{asset.name|swiftIdentifier:"pretty"|escapeReservedKeywords}} {
{{sp}}    {% set sp2 %}{{sp}}  {% endset %}
{{sp}}    {% call casesBlock asset.items sp2 %}
{{sp}}  }
{{sp}}  {% endif %}
{{sp}}  {% endfor %}
{% endmacro %}
{% macro allValuesBlock assets filter prefix sp %}
{{sp}}  {% for asset in assets %}
{{sp}}  {% if asset.type == filter %}
{{sp}}  {{prefix}}{{asset.name|swiftIdentifier:"pretty"|lowerFirstWord|escapeReservedKeywords}},
{{sp}}  {% elif asset.items %}
{{sp}}  {% set prefix2 %}{{prefix}}{{asset.name|swiftIdentifier:"pretty"|escapeReservedKeywords}}.{% endset %}
{{sp}}  {% call allValuesBlock asset.items filter prefix2 sp %}
{{sp}}  {% endif %}
{{sp}}  {% endfor %}
{% endmacro %}

enum {{enumName}} {
{% if catalogs.count > 1 %}
{% for catalog in catalogs %}
enum {{catalog.name|swiftIdentifier:"pretty"|escapeReservedKeywords}} {
{% call enumBlock catalog.assets "  " %}
}
{% endfor %}
{% else %}
{% call enumBlock catalogs.first.assets "" %}
{% endif %}
}

extension {{imageAlias}} {
convenience init!(asset: {{imageType}}) {
let bundle = Bundle(for: BundleToken.self)
self.init(named: asset.name, in: bundle, compatibleWith: nil)
}
}

private final class BundleToken {}
{% else %}
// No assets found
{% endif %}
```

## 2.建立RunScript

</li>
<li><p>在<code>Xcode</code>中，进入到项目的<code>Target</code>，选择<code>Build Phases</code>,然后点击左上角的 <code>+</code> 号后点击 <code>New Run Script Phase</code>在新建的RunScript里添加如下内容：</p>
  

```bash
if which "$PROJECT_DIR"/SwiftGen5/bin/swiftgen >/dev/null;
then
set -e
"$PROJECT_DIR"/SwiftGen5/bin/swiftgen xcassets -t my-swift4 "$PROJECT_DIR/swiftGenExample/Assets.xcassets" --output "$PROJECT_DIR/swiftGenExample/ImageCode/ImageAsset.swift"
else
echo "##run echo warning: SwiftGen not installed, download it from https://github.com/SwiftGen/SwiftGen"
fi
```

<p>  这段 <code>Run Script</code> 作用就是利用 SwiftGen 生成代码后写入到 <code>ImageAsset.swift</code> 文件中。</p>
</li>
<li><p>Build 一下project，我们就可以在 <code>/swiftGenExample/ImageCode/</code> 目录下看到 <code>ImageAsset.swift</code>，此时该文件还没有被项目索引，所以把它拖进项目Xcode对应的目录下就行了，之后即使我们添加了新的图片或者删掉旧的图片，只要每次Build一下项目，代码就会自动更新了。</p>
</li>
</ul>
<p>下面是生成的 <code>ImageAsset.swift</code> 的代码：</p>

```swift
// ImageAsset.swift
// Generated using SwiftGen, using my-templete created by Hanson

import UIKit.UIImage

typealias Image = UIImage

@available(*, deprecated, renamed: "ImageAsset")
typealias AssetType = ImageAsset

struct ImageAsset {
    fileprivate var name: String

    var image: Image {
        let bundle = Bundle(for: BundleToken.self)
        let image = Image(named: name, in: bundle, compatibleWith: nil)
        guard let result = image else { fatalError("Unable to load image named \(name).") }
        return result
    }
}

enum Asset {
    static let arrowBlue = ImageAsset(name: "arrow_blue")
    static let arrowBrown = ImageAsset(name: "arrow_brown")
    static let iconLeftBack = ImageAsset(name: "icon_left_back")
    static let startLogo = ImageAsset(name: "start_logo")
}

extension Image {
    convenience init!(asset: ImageAsset) {
    let bundle = Bundle(for: BundleToken.self)
    self.init(named: asset.name, in: bundle, compatibleWith: nil)
    }
}

private final class BundleToken {}
```

# 结语

<p>这里只是利用了 <code>SwiftGen</code> 对于 <code>Image</code> 的部分。它还有其它的关于 <code>String</code> ，<code>StroyBoard</code>，<code>Font</code>等等的代码生成。原理基本相同，靠大家按需研究啦。</p>
<blockquote>
<p>到我的博客阅读：<a href="http://www.myhanson.com/2017/12/08/%E7%94%A8SwiftGen%E7%AE%A1%E7%90%86UIImage%E7%AD%89%E7%9A%84String-based%E6%8E%A5%E5%8F%A3/#more" target="_blank" rel="noopener">myhanson.com</a><br>本文Demo：<a href="https://github.com/zyphs21/SwiftGenExample" target="_blank" rel="noopener">SwiftGenExample</a></p>
</blockquote>
