---
title: HSStockChart
description: 一个用于绘制股票分时图和 K 线图的 Swift 库，支持回弹拖动、长按十字线和捏合缩放，主要使用 CAShapeLayer 绘图。
status: archived
tech: [Swift, iOS, Chart, CAShapeLayer]
featured: true
links:
  github: https://github.com/zyphs21/HSStockChart
  article: /blog/
---

HSStockChart 是早期整理出来的股票图表组件，包含分时图、五日分时图、K 线图、MA 线指标和交易量柱等常见图表形态。

项目里的重点不是单纯画静态图，而是把图表交互也一起处理好：滑动查看、横屏展示、长按十字线、捏合缩放，以及通过 `UIScrollView` 让 K 线图保持流畅浏览。

代码主要使用 `CAShapeLayer` 绘图，相比直接重写 `drawRect`，更适合把图层组织、交互状态和性能控制拆开处理。
