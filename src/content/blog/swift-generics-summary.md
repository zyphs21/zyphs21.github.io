---
title: "Swift的泛型小总结"
description: "本文针对网上一些关于泛型的知识点进行汇总和总结，已在文中标记出参考文章的链接 泛型是程序设计语言的一种特性。允许程序员在强类型程序设计语言中编写代码时定义一些可变部分，那些部分在使用前必须作出指明。"
date: 2018-08-05
updated: 2020-04-17
topics: ["Swift / iOS"]
tags: ["Swift", "Swift / iOS"]
featured: false
legacyPath: "/2018/08/05/Swift 的泛型小总结/"
---
<p><strong>本文针对网上一些关于泛型的知识点进行汇总和总结，已在文中标记出参考文章的链接</strong></p>
<blockquote>
<p>泛型是程序设计语言的一种特性。允许程序员在强类型程序设计语言中编写代码时定义一些可变部分，那些部分在使用前必须作出指明。</p>
</blockquote>

<p><code>Objective-C</code> 缺乏一个重要特性:不支持泛型。幸运地是，<code>Swift</code>拥有这一特性。==泛型允许你声明的函数、类以及结构体支持不同的数据类型==。</p>
<p>泛型代码可以让你写出根据自我需求定义、适用于任何类型的，灵活且可重用的函数和类型。它的可以让你避免重复的代码，用一种清晰和抽象的方式来表达代码的意图。</p>
<p>泛型是 Swift 强大特征中的其中一个，许多 Swift 标准库是通过泛型代码构建出来的。事实上，泛型的使用贯穿了整本语言手册，只是你没有发现而已。 <span style="border-bottom:2px solid brown;">例如，Swift 的数组和字典类型都是泛型集。你可以创建一个Int数组，也可创建一个String数组，或者甚至于可以是任何其他 Swift 的类型数据数组。同样的，你也可以创建存储任何指定类型的字典（dictionary），而且这些类型可以是没有限制的。</span></p>
<blockquote>
<p><a href="https://swift.gg/2015/09/16/swift-generics/" target="_blank" rel="noopener">参考</a></p>
</blockquote>

## 实现栈的例子，说明泛型的作用

```swift
class IntStack{
  // 采用数组作为容器保存数据 类型为Int
  private var stackItems:[Int] = []
  // 入栈操作 即Push 添加最新数据到容器最顶部
  func pushItem(item:Int){
    stackItems.append(item)    
  }
  // 出栈操作 即Pop 将容器最顶部数据移除
  func popItem()->Int?{
    let lastItem = stackItems.last
    stackItems.removeLast()
    return lastItem
  }
}
```

<p>这栈能够处理<code>Int</code>类型数据。但是如果要一个能够处理<code>String</code>类型的栈呢？我们需要替换所有<code>Int</code>为<code>String</code>，不过这显然是一个糟糕的解决方法。此外另外一种方法是用<code>AnyObject</code>，如下:</p>

```text
class AnyObjectStack{
  // 采用数组作为容器保存数据 类型为AnyObject
  private var stackItems:[AnyObject] = []
  
  func pushItem(item:AnyObject){
    stackItems.append(item)    
  }
  
  func popItem()->AnyObject?{
    let lastItem = stackItems.last
    stackItems.removeLast()
    return lastItem
  }    
}
```

<p>不过这种情况下我们就失去了数据类型的安全，并且每当我们对栈进行操作时,都需要进行一系列繁琐的类型转换(casting操作,使用as来进行类型转换)</p>
<ul>
<li>通过泛型来解决：</li>
</ul>

```text
class Stack<T> {

  private var stackItems: [T] = []  

  func pushItem(item:T) {
    stackItems.append(item)
  }  
  
  func popItem() -> T? {
    let lastItem = stackItems.last
    stackItems.removeLast()
    return lastItem
  }

}
```

<p>泛型定义方式:由一对尖括号(&lt;&gt;)包裹，命名方式通常为大写字母开头(这里我们命名为T)。在初始化阶段，我们通过明确的类型(这里为Int)来定义参数,之后编译器将所有的泛型T替换成Int类型:</p>

```text
// 指定了泛型T 就是 Int 
// 编译器会替换所有T为Int
let aStack = Stack<Int>()

aStack.pushItem(10)
if let lastItem = aStack.popItem() {
  print("last item: \(lastItem)")
}
```

## 泛型扩展

<blockquote>
<p><a href="http://swifter.tips/extension-generic/" target="_blank" rel="noopener">参考</a></p>
</blockquote>
<p>Swift 对于泛型的支持使得我们可以避免为类似的功能多次书写重复的代码，这是一种很好的简化。而对于泛型类型，我们也可以使用 extension 为泛型类型添加新的方法。</p>
<p>与为普通的类型添加扩展不同的是，<span style="border-bottom: 2px solid brown">泛型类型在类型定义时就引入了类型标志，我们可以直接使用</span>。例如 Swift 的 Array 类型的定义是：</p>

```text
public struct Array<Element> : CollectionType, Indexable, ... {
    //...
}
```

<p>在这个定义中，已经声明了 <code>Element</code> 为泛型类型。在为类似这样的泛型类型写扩展的时候，我们不需要在 extension 关键字后的声明中重复地去写 <code>&lt;Element&gt;</code> 这样的泛型类型名字 (其实编译器也不允许我们这么做)，在扩展中可以使用和原来所定义一样的符号即可指代类型本体声明的泛型。比如我们想在扩展中实现一个 random 方法来随机地取出 Array 中的一个元素</p>

```text
extension Array {
    var random: Element? {
        return self.count != 0 ?
          self[Int.random(in: 0..<self.count)] : nil
        // self[Int(arc4random_uniform(UInt32(self.count)))]
    }
}

let languages = ["Swift","ObjC","C++","Java"]
languages.random!
// 随机输出是这四个字符串中的某个

let ranks = [1,2,3,4]
ranks.random!
// 随机输出是这四个数字中的某个
```

<p><span style="border-bottom: 2px solid brown">在扩展中是不能添加整个类型可用的新泛型符号的，但是对于某个特定的方法来说，我们可以添加 T 以外的其他泛型符号</span>。比如在刚才的扩展中加上：</p>

```text
func appendRandomDescription
    <U: CustomStringConvertible>(input: U) -> String {

        if let element = self.random {
            return "\(element) " + input.description
        } else {
            return "empty array"
        }
}
```

<p>我们限定了只接受实现了 <code>CustomStringConvertible</code> 的参数作为参数，然后将这个内容附加到自身的某个随机元素的描述上。因为参数 input 实现了 <code>CustomStringConvertible</code>，所以在方法中我们可以使用 description 来获取描述字符串。</p>

```text
let languages = ["Swift","ObjC","C++","Java"]
languages.random!

let ranks = [1,2,3,4]
ranks.random!

languages.appendRandomDescription(ranks.random!)
// 随机组合 languages 和 ranks 中的各一个元素，然后输出
```

<p>虽然这是个生造的需求，但是能说明泛型在扩展里的使用方式。简单说就是我们++不能通过扩展来重新定义当前已有的泛型符号，但是可以对其进行使用；在扩展中也不能为这个类型添加泛型符号；但只要名字不冲突，我们是可以在新声明的方法中定义和使用新的泛型符号的++。</p>

## typealias 和 泛型

### typealias 作用

<blockquote>
<p><a href="http://swifter.tips/typealias/" target="_blank" rel="noopener">参考</a></p>
</blockquote>
<p>typealias 是用来为已经存在的类型重新定义名字的，通过命名，可以使代码变得更加清晰。使用的语法也很简单，使用 typealias 关键字像使用普通的赋值语句一样，可以将某个已经存在的类型赋值为新的名字。比如在计算二维平面上的距离和位置的时候，我们一般使用 Double 来表示距离，用 CGPoint 来表示位置：</p>

```text
func distanceBetweenPoint(point: CGPoint, toPoint: CGPoint) -> Double {
    let dx = Double(toPoint.x - point.x)
    let dy = Double(toPoint.y - point.y)
    return sqrt(dx * dx + dy * dy)
}

let origin: CGPoint = CGPoint(x: 0, y: 0)
let point: CGPoint = CGPoint(x: 1, y: 1)

let distance: Double =  distanceBetweenPoint(origin, point)
```

<p>虽然在数学上和最后的程序运行上都没什么问题，但是阅读和维护的时候总是觉得有哪里不对。因为我们没有将数学抽象和实际问题结合起来，使得在阅读代码时我们还需要在大脑中进行一次额外的转换：CGPoint 代表一个点，而这个点就是我们在定义的坐标系里的位置；Double 是一个数字，它代表两个点之间的距离。</p>
<p>如果我们使用 typealias，就可以将这种转换直接写在代码里，从而减轻阅读和维护的负担：</p>

```text
import UIKit

typealias Location = CGPoint
typealias Distance = Double

func distanceBetweenPoint(location: Location,
    toLocation: Location) -> Distance {
        let dx = Distance(location.x - toLocation.x)
        let dy = Distance(location.y - toLocation.y)
        return sqrt(dx * dx + dy * dy)
}

let origin: Location = Location(x: 0, y: 0)
let point: Location = Location(x: 1, y: 1)

let distance: Distance =  distanceBetweenPoint(origin, toLocation: point)
```

<p>同样的代码，在 typealias 的帮助下，读起来就轻松多了。</p>

### 用 typealias 给泛型重命名

<p>泛型类型的确定性得到保证后，才可以重命名</p>

```text
class Person<T> {}

typealias WorkId = String
typealias Worker = Person<WorkId>
```

## 在协议中使用 associatedtype

<blockquote>
<p><a href="https://numbbbbb.gitbooks.io/-the-swift-programming-language-/content/chapter2/22_Generics.html" target="_blank" rel="noopener">参考</a></p>
</blockquote>
<p>定义一个协议时，有的时候声明一个或多个关联类型作为协议定义的一部分将会非常有用。关联类型为协议中的某个类型提供了一个占位名（或者说别名），其代表的实际类型在协议被采纳时才会被指定。你可以通过 associatedtype 关键字来指定关联类型。</p>
<p>新建一个Container协议</p>

```text
protocol Container {
    associatedtype Item
    mutating func append(_ item: Item)
    var count: Int { get }
    subscript(i: Int) -> Item { get }
}
```

<p>可以给协议里的关联类型添加类型注释，让遵守协议的类型必须遵循这个约束条件。例如，下面的代码定义了一个 Item 必须遵循 Equatable 的 Container 类型：</p>

```text
protocol Container {
    associatedtype Item: Equatable
    mutating func append(_ item: Item)
    var count: Int { get }
    subscript(i: Int) -> Item { get }
}
```

<p>生成遵循Container协议的泛型Stack:</p>

```text
struct Stack<T>: Container {
    // original Stack<T> implementation
    var items = [T]()
    mutating func push(_ item: T) {
        items.append(item)
    }
    mutating func pop() -> T {
        return items.removeLast()
    }
    // 遵循Container协议的实现
    mutating func append(_ item: T) {
        self.push(item)
    }
    var count: Int {
        return items.count
    }
    subscript(i: Int) -> T {
        return items[i]
    }
}
```

## 类型约束

<blockquote>
<p><a href="https://numbbbbb.gitbooks.io/-the-swift-programming-language-/content/chapter2/22_Generics.html" target="_blank" rel="noopener">参考</a></p>
</blockquote>

### 实现Equtable协议,使得泛型可以比较

```text
class Stack<T:Equatable> {

  private var stackItems: [T] = []

  func pushItem(item:T) {
    .append(item)
  }

  func popItem() -> T? {
    let lastItem = stackItems.last
    stackItems.removeLast()
    return lastItem
  }

  func isItemInStack(item:T) -> Bool {
    var found = false
    for stackItem in stackItems {
      // 如果没有 <T:Equatable> 这里会报错
      if stackItem == item {
        ound = true
      }
    }
    return found
  }
}
```

### Where 语句

```text
func allItemsMatch<
    C1: Container, C2: Container
    where C1.ItemType == C2.ItemType, C1.ItemType: Equatable>
    (someContainer: C1, anotherContainer: C2) -> Bool {

        // 检查两个Container的元素个数是否相同
        if someContainer.count != anotherContainer.count {
            return false
        }

        // 检查两个Container相应位置的元素彼此是否相等
        for i in 0..<someContainer.count {
            if someContainer[i] != anotherContainer[i] {
                return false
            }
        }

        // 如果所有元素检查都相同则返回true
        return true
}
```
