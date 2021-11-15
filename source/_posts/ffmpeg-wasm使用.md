---
title: ffmpeg-wasm使用
date: 2021-11-15 09:03:00
tags: [WebAssembly,FFmpeg,javascript,utils]
---
[FFmpeg](https://zh.wikipedia.org/wiki/FFmpeg)是一款流行的开放源代码的自由软件。随着[WebAssembly](https://zh.wikipedia.org/wiki/WebAssembly)快速发展，[FFmpeg wasm](https://github.com/ffmpegwasm/ffmpeg.wasm)也随机诞生了。

## 使用


### 代码

本例子在浏览器环境运行


``` javascript
await ffmpeg.load();
```
**ffmpeg.load** 会从远程获取**ffmpeg-core.js**、**ffmpeg-core.wasm**和**ffmpeg-core.worker.js**三个文件

``` javascript
document.getElementById("uploader").addEventListener("change", transcode);

const transcode = async ({ target: { files } }) => {
    ...
    const { name } = files[0];
    ffmpeg.FS("writeFile", name, await fetchFile(files[0]));
    
    ...
}

```
我们监听了input的变化，拿到了文件名称，**ffmpeg.FS**读取了文件


``` javascript
await ffmpeg.run("-i", name, "-r", "20", "-s", "640x480", "output.mp4")
// 与命令行 `$ ffmpeg -i name -r 20 -s 1920x1080 output.mp4` 相同
const data = ffmpeg.FS("readFile", "output.mp4");
const video = document.getElementById("player");
video.src = URL.createObjectURL(
    new Blob([data.buffer], { type: "video/mp4" })
);
```

1. **ffmpeg.run**是ffmpeg wasm的核心方法，接受参数与普通的ffmpeg大部分相同
2. **ffmpeg.FS**从output.mp4读取
3. 将其转换成base64，并填充入页面内video元素的src属性中


以下是完整代码

``` html
<!DOCTYPE html>
<html>
  <head>
    <title>ffmpeg wasm</title>
    <meta charset="UTF-8" />
    <meta http-equiv="origin-trial" content="REGISTER GET TOKEN">

  </head>

  <body>
    <video id="player" controls></video>
    <div>
      <input type="file" id="uploader" />
    </div>
    <div id="message">Message</div>
    <script src="https://cdn.jsdelivr.net/npm/@ffmpeg/ffmpeg@0.10.1/dist/ffmpeg.min.js"></script>
    <script>
      const message = document.getElementById("message");
      const { createFFmpeg, fetchFile } = FFmpeg;
      const ffmpeg = createFFmpeg({
        log: true,
        progress: ({ ratio }) => {
          message.innerHTML = `Complete: ${(ratio * 100.0).toFixed(2)}%`;
        }
      });
      const transcode = async ({ target: { files } }) => {
        console.time("transcode");
        const { name } = files[0];
        await ffmpeg.load();
        ffmpeg.FS("writeFile", name, await fetchFile(files[0]));
        // await ffmpeg.run("-i", name, "output.mp4");
        await ffmpeg.run("-i", name, "-r", "20", "-s", "640x480", "output.mp4")
        const data = ffmpeg.FS("readFile", "output.mp4");
        const video = document.getElementById("player");
        video.src = URL.createObjectURL(
          new Blob([data.buffer], { type: "video/mp4" })
        );
        console.timeEnd("transcode");
      };
      document.getElementById("uploader").addEventListener("change", transcode);
    </script>
    <!-- <script src="src/index.js"></script> -->
  </body>
</html>

```

## 运行

``` bash
npm init -y // 快速初始化
npm i serve // or yarn add serve
./node_modules/.bin/serve -s .
```

如需开启HTTPS环境，请自行生成**cert.pem**和**key.pem**

``` bash
openssl req -x509 -newkey rsa:2048 -keyout key.pem -out cert.pem -days 365
```

再次执行
``` bash
./node_modules/.bin/serve --ssl-cert cert.pem --ssl-key key.pem -s .
```

[SharedArrayBuffer](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) 仅可用在 [cross-origin isolated](https://developer.chrome.com/blog/enabling-shared-array-buffer/#cross-origin-isolation) 环境下. 所以您的服务器需配置 **Cross-Origin-Embedder-Policy: require-corp** 和 **Cross-Origin-Opener-Policy: same-origin** ， ffmpeg.wasm 才能使用。

你可以手动修改 node_modules/.bin/serve 文件，添加Headers
``` javascript 
const serverHandler = async (request, response) => {
	response.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
	response.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
	...
    ...
	return handler(request, response, config);
};
```
> node_modules/.bin/serve 文件, 此修改只适用于临时需要，仅作为参考


### 测试

以下数据为mp4视频文件压缩效果

![](/images/ffmpeg_file.png)
> 测试所用文件信息

| 序号 | 浏览器 | 文件 | 时长 | 备注 |
| :------ | :-----: | ------: | ------: | ------: |
| 1 | Chrome 97.0.4692.8（正式版本）dev (x86_64) | 33.6 MB | 116350 ms |  |
| 2 | Firefox 93.0 (64 位) | 33.6 MB | 74627 ms |  |
| 3 | Safari 15.0 (16612.1.29.41.4, 16612) | 33.6 MB | ---- | SharedArrayBuffer无法正常使用，无法测试 |
| 4 | Chrome for Android 95.0.4638.74  | 33.6 MB | 91518 ms | https环境下，操作系统Android 11;IN2020 Build/RKQ1.201105.002 |
| 4 | Firefox for Android 94.1.2  | 33.6 MB | ---- | 无法使用 |


## 结论

[WebAssembly](https://zh.wikipedia.org/wiki/WebAssembly)的迅速发展，浏览器环境中的很多从前不能实现的功能，已慢慢得到补充。虽然兼容性还需等待各大浏览器厂商去适配，但相信很快就能完美实现。
