---
title: lottie-web使用
date: 2021-11-22 15:52:03
tags: [javascript,android,ios,web,utils]
excerpt: Lottie是一个适用于Android、iOS、Web 和 Windows 的库，它通过使用Bodymovin解析并导出为json的Adob​​e After Effects 动画，并在移动终端(Android和IOS)和Web端上呈现！
---

[Lottie](https://airbnb.design/lottie/)是一个适用于Android、iOS、Web 和 Windows 的库，它通过使用[Bodymovin](https://github.com/bodymovin/bodymovin)解析并导出为json的[Adob​​e After Effects](https://zh.wikipedia.org/zh/Adobe_After_Effects) 动画，并在移动终端(Android和IOS)和Web端上呈现！

今天我介绍的是[Lottie-web](https://github.com/airbnb/lottie-web)，有[airbnb](https://zh.wikipedia.org/wiki/Airbnb)的支持、体积小和丰富的交互函数，能非常简单地显示Adob​​e After Effects 动画。

### 安装

``` bash
# with npm
npm install lottie-web

# with yarn
yarn add lottie-web
```

### 使用


``` html
<!DOCTYPE html>
<html>
  <head>
    <title>Parcel Sandbox</title>
    <meta charset="UTF-8" />
  </head>

  <body>
    <div class="btn" id="start">
      <span>Start</span>
      <div class="count" id="countIcon"></div>
    </div>
    <script src="src/index.js"></script>
  </body>
</html>
```
我们需要创建一个id为"countIcon"的容器，用于装载动画


``` javascript
import "./styles.css";
import Lottie from "lottie-web";
import json from "./loader-count.json"; // 动画数据

const countIcon = document.getElementById("count-icon");
const start = document.getElementById("start");
const countAnimation = Lottie.loadAnimation({
  container: countIcon, // 存放动画的容器
  renderer: "svg", // 支持svg、canvas和html三种，这里我们用svg
  loop: false, // 是否循环
  autoplay: false, // 是否自动播放
  animationData: json
});

```

我们从UI妹子❤️ 那里拿来一个通过使用[Bodymovin](https://github.com/bodymovin/bodymovin)解析并导出为json的Adob​​e After Effects 动画"loader-count.json"文件。我们使用[loadAnimation](https://github.com/airbnb/lottie-web#lottie-has-several-global-methods-that-will-affect-all-animations)方法，传入对应参数。其中要注意的是**renderer**渲染器，我们可以使用[svg](https://developer.mozilla.org/zh-CN/docs/Web/SVG)、[canvas](https://developer.mozilla.org/zh-CN/docs/Web/API/Canvas_API)和**html**三种方式。


``` javascript
countAnimation.addEventListener("complete", (result) => {
  console.log("complete!!!");
});
countAnimation.setSegment(3, countAnimation.totalFrames);

start.addEventListener("click", () => {
  // console.log(countAnimation.isPaused);
  countAnimation.togglePause();
});
```

这里我对动画的[complete事件](https://github.com/airbnb/lottie-web#events)进行监听了，且设置从动画的**3帧**开始，到动画的最后一帧**totalFrames**。我们在配置参数**autoplay**设置为**true**。所以我们需要通过**togglePause**方法触发动画。

最后，我们点击按钮，动画流畅的运行起来了😄

完整代码: [在线运行](https://codesandbox.io/s/lottie-web-demo-w8eds?file=/src/index.js)


### 总结

这样我们就能通过UI妹子❤️ 提供的Adob​​e After Effects 动画，完成一些复杂的动画。如直播中，粉丝给主播送礼物等。