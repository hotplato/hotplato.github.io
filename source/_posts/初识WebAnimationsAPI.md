---
title: 初识WebAnimationsAPI
date: 2021-11-12 10:04:01
tags: [web,javascript,animations]
---

当我们web端做起动画的第一想到的是CSS Animations，但今天我们将其转移到Javascript中去，在构建动画库和创建交互动画，提供了更完善的工具。

### 例子

``` javascript
const app = document.getElementById("app");

app.addEventListener("click", () => {
  console.log("start animations...");
  app.animate(
    [{ transform: "rotate(0deg)" }, { transform: "rotate(360deg)" }],
    {
      duration: 1000
    }
  );
});
```

当我们点击蓝色矩形，矩形将会旋转360度持续1000毫秒。其中[animate](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/animate)方法接受[KeyframeEffect](https://developer.mozilla.org/en-US/docs/Web/API/KeyframeEffect)关键帧组，和一个可选项[Options](https://developer.mozilla.org/en-US/docs/Web/API/KeyframeEffect/KeyframeEffect)。从上面的代码，可以看到实现一个动画非常简单，只要将之前的CSS样式转移到javascript来，就能便捷地使用Web Animations API。

| key | 类型 | 解释 | 默认值 |
| :------ | :-----: | ------: | ------: |
| delay | number | 动画开始延迟时长，单位**毫秒** | 0 |
| direction | string  | 动画运行方向，可用值normal正向,reverse反向,alternate交替,alternate-reverse交替反向 | normal |
| duration | number | 动画完成所需时长，单位**毫秒**，如果值为0，动画将不会开始 | 0 |
| easing | string  | 速率，linear, ease, ease-in, ease-out, 和ease-in-out, 或自定义cubic-bezier(0.42, 0, 0.58, 1) | linear |
| endDelay | number  | 动画结束后延迟时长 | 0 |
| fill | string  | auto,backwards,both,forwards,none | none |
| iterationStart | number  | 重复运行，在那个时间点再次运行。如0.5会在第一次动画中途执行， | 0.0 |
| iterations | number  | 重复次数，无限用Infinity | 1 |
| composite | string | add,accumulate和replace | replace |
| iterationComposite | string  | ---- | replace |

完整代码: [Live Demo](https://codesandbox.io/s/web-animations-api-1-t76x0?file=/src/index.js)




### 交互例子

``` javascript
const app = document.getElementById("app");
const start = document.getElementById("start");
const pause = document.getElementById("pause");
const cancel = document.getElementById("cancel");
const finish = document.getElementById("finish");
const reverse = document.getElementById("reverse");

let anim = app.animate(
  [
    { width: "24em", borderRadius: 0 },
    { width: "6em", borderRadius: 0 },
    { width: "6em", borderRadius: "50%" }
  ],
  {
    duration: 3000,
    fill: "forwards"
  }
);
anim.addEventListener("finish", (evt) => {
  console.log("web animations finished...");
});
anim.addEventListener("cancel", (evt) => {
  console.log("web animations cancel...");
});
anim.addEventListener("remove", (evt) => {
  console.log("web animations remove...");
});
pause.addEventListener("click", () => {
  anim.pause();
});
cancel.addEventListener("click", () => {
  anim.cancel();
});
finish.addEventListener("click", () => {
  anim.finish();
});
reverse.addEventListener("click", () => {
  anim.reverse();
  // 以下同样效果
  // anim.playbackRate = -1;
  // anim.play();
});
start.addEventListener("click", () => {
  anim.play();
});
```
动画开始是矩形变成正方形，最后变成圆形。我们可以点击按钮，将动画切换成对应的状态。
web animations api提供[play](https://developer.mozilla.org/zh-CN/docs/Web/API/Animation/play)播放，[pause](https://developer.mozilla.org/en-US/docs/Web/API/Animation/pause)暂停，[cancel](https://developer.mozilla.org/zh-CN/docs/Web/API/Animation/cancel)取消，[finish](https://developer.mozilla.org/zh-CN/docs/Web/API/Animation/finish)结束和[reverse](https://developer.mozilla.org/en-US/docs/Web/API/Animation/reverse)反向方法，同时也支持finish，cancel和remove事件。

完整代码: [Live Demo](https://codesandbox.io/s/web-animations-api-2-ublsg?file=/src/index.js)


### 兼容性

![](/images/webanimationsuse.png)

web Animations API还是不错的，如果实在要兼容浏览器 [web-animations-js](https://github.com/web-animations/web-animations-js) 可以帮助你


## 总结
web Animations API 提供了完善的方法，构建复杂的动画更方便了。而简单的动画，我觉得还是用CSS Animations。

