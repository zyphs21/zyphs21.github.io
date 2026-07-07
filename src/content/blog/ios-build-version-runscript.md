---
title: "通过RunScript给iOS项目自增版本号(Versioin和Build)"
description: "RunScript给iOS项目自增版本号"
date: 2018-03-14
updated: 2020-04-17
topics: ["Swift / iOS"]
tags: ["iOS开发", "iOS", "Swift / iOS"]
featured: false
legacyPath: "/2018/03/14/通过 RunScript 给 iOS 项目自增版本号(Versioin和Build)/"
---
## 需求分析

<ul>
<li>在打包应用之后，需要自增 <strong>Version 的最后一位</strong> 和 <strong>Build</strong> 的值。<br><img src="https://user-gold-cdn.xitu.io/2018/3/14/162201d291ebc6c1?w=690&h=136&f=png&s=11268" alt=""></li>
<li>只在 Archive(Release) 的时候触发该自增。</li>
</ul>

## 添加 RunScript

<p>在 <code>项目Target</code> -&gt; <code>Build Phases</code> -&gt; <code>点击+号</code> -&gt; <code>New Run Script Phase</code></p>
<p>然后添加如下内容：</p>

```bash
if [ $CONFIGURATION == Release ]; then
echo "当前为 Release Configuration,开始自增 Build"
plist=${INFOPLIST_FILE}
buildnum=$(/usr/libexec/PlistBuddy -c "Print CFBundleVersion" "${plist}")
if [[ "${buildnum}" == "" ]]; then
echo "Error：在Plist文件里没有 Build 值"
exit 2
fi
buildnum=$(expr $buildnum + 1)
/usr/libexec/PlistBuddy -c "Set CFBundleVersion $buildnum" "${plist}"

echo "开始自增 Version 最后一位"
versionNum=$(/usr/libexec/PlistBuddy -c "Print CFBundleShortVersionString" "${plist}")
thirdPartVersonNum=`echo $versionNum | awk -F "." '{print $3}'`
thirdPartVersonNum=$(($thirdPartVersonNum + 1))
newVersionStr=`echo $versionNum | awk -F "." '{print $1 "." $2 ".'$thirdPartVersonNum'" }'`
/usr/libexec/PlistBuddy -c "Set CFBundleShortVersionString $newVersionStr" "${plist}"
else
echo $CONFIGURATION "当前不为 Release Configuration"
fi
```

## 注意

<p>因为我的版本号是<code>xx.xx.xx</code>这样的形式，所以我以 <code>.</code> 拆分版本号后，取出第三个值来增加，最后再拼接回来。</p>

```text
versionNum=$(/usr/libexec/PlistBuddy -c "Print CFBundleShortVersionString" "${plist}")
# 这里取出第三个值
thirdPartVersonNum=`echo $versionNum | awk -F "." '{print $3}'`
```
