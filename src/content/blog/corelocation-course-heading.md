---
title: "CoreLocation 中的 Course 和 Heading 简析"
description: "很多地图 App 都会有一个当前定位的标记，该标记可以根据用户手持手机的朝向不同而改变方向。如图： 如果要实现这个带方向定位的标记点，需要什么数据呢？"
date: 2020-04-15
updated: 2020-04-17
topics: ["Swift / iOS"]
tags: ["iOS开发", "CoreLocation", "Swift / iOS"]
featured: false
legacyPath: "/2020/04/15/CoreLocation 中的 Course 和 Heading 简析/"
---
<p>很多地图 App 都会有一个当前定位的标记，该标记可以根据用户手持手机的朝向不同而改变方向。如图：</p>
<img src="https://imgkr.cn-bj.ufileos.com/6a305cfc-4d8e-4f17-ad25-d40534e29aec.png" width = "80" height = "80" alt="带方向的定位标记" align=center />

<p>如果要实现这个带方向定位的标记点，需要什么数据呢？</p>

<ul>
<li>定位数据</li>
<li>手机朝向数据</li>
</ul>
<p>定位数据获取很简单，调用 <code>CLLocationManager</code> 的 <code>startUpdatingLocation()</code> 方法，然后在 <code>didUpdateLocations</code> 的回调方法中可以得到的 <code>CLLocation</code> 属性值。</p>
<p><code>CLLocation</code> 对象中，除了有我们需要的 coordinate 位置数据外，还有一个 <code>course</code> 属性。</p>
<p>这个 <code>course</code> 属性是不是我们需要的手机朝向数据呢？</p>
<blockquote>
<p>course:<br>The direction in which the device is traveling, measured in degrees and relative to due north.</p>
</blockquote>
<blockquote>
<p>Course values are measured in degrees starting at due north and continue clockwise around the compass. Thus, north is 0 degrees, east is 90 degrees, south is 180 degrees, and so on. Course values may not be available on all devices. A negative value indicates that the course information is invalid.</p>
</blockquote>
<p>从文档的解释来看，它是一个相对于地理北极以顺时针方向的角度数据，手机朝着正北方是 0 度，朝着东边是 90度，依次类推。</p>
<p>看起来是我们想要的值。但是从实际测试(真机室内测试)结果看，<strong>这个值一直是返回 -1 。（负数代表此值当前不可用）</strong></p>
<p>排除使用方式的不对，我们从文档 <a href="https://developer.apple.com/documentation/corelocation/getting_heading_and_course_information" target="_blank" rel="noopener">Getting Heading and Course Information</a> 发现，我们要获取的其实是 <code>heading</code>  的数据。</p>
<p>通过调用 CLLocationManager 中的 </p>
<pre><code>startUpdatingHeading()</code></pre><p>然后在 <code>locationManager(_:didUpdateHeading:)</code> 的回调方法中就可以获取到 heading 的数据了。</p>

## Course 和 Heading

<p>从字面意思上我们可以将它们区分为 <code>航向</code> 和 <code>朝向</code></p>
<p><code>Course(航向)信息</code> 反映的是设备移动的速度和方向，并且仅在具有GPS硬件条件的设备上可用。</p>
<p>注意不要将 <code>Course(航向)</code> 与 <code>Heading(朝向)</code> 混淆。Course(航向) 反映的是设备移动时的方向，是<strong>从GPS信息中获取到，它与设备的物理方向无关</strong>。</p>
<p>而 <code>Heading(朝向)信息</code> 则是通过计算手机上传感器的值而获取到的相对于地理北极的角度信息。</p>

### Course

<p>Course 常常是用在进行导航的情况下。比如平时我们开车进行导航的时候，有时候车子转弯过快，会发现导航上的朝向并没有及时更新到正确的方向，要过一会才会更新，这就是因为 GPS 信息没有及时更新过来，故 Course 信息也就无法有足够的数据支持它更新。</p>

### Heading

<p>Heading 是与物理设备有关的值，所以我们在获取 Heading 信息的时候，注意要配置 CLLocationManager 的 <code>headingOrientation</code> 属性。</p>
<p>headingOrientation 默认值是 <code>portrait</code> ，即我们平时正面拿着手机。而当我们正面横着拿手机的时候，需要将 <code>headingOrientation</code> 属性根据实际情况改成 <code>landscapeLeft</code> 或者 <code>landscapeRight</code>，这样系统才能通过手机的持有方位计算正确的 <code>Heading</code> 值，不然 Heading 就一直是默认以 portrait 的形式计算得到。</p>
