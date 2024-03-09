---
title: Flutter UI上显示原生页面(安卓)
date: "2023-07-14 14:22:00"
tags: [flutter,android]
summary: Android View 快速显示在Flutter UI 上的方法
---

flutter 可实现将原生页面托管到 Flutter UI 中，并支持**混合**和**虚拟**显示模式。

混合模式，将原生 android.view.View 直接添加到 flutter 的视图中。能保持View 大部分功能。

虚拟模式，是将原生 android.view.View 作为实例渲染成纹理，个别功能无法正常。

## 实现方法

混合和虚拟模式，使用区别只在 dart 代码中

### 混合模式
```dart
Widget build(BuildContext context) {
	const String viewType = '<platform-view-type>'; //托管页面标识
	final Map<String, dynamic> creationParams = <String, dynamic>{}; //传入原生页面的参数
	
	return Scaffold(
		body: PlatformViewLink(
		surfaceFactory: (context, controller) {
		return AndroidViewSurface(
			controller: controller as AndroidViewController,
			hitTestBehavior: PlatformViewHitTestBehavior.opaque,
			gestureRecognizers: const <Factory<OneSequenceGestureRecognizer>>{});
		},
		onCreatePlatformView: (params) {
			return PlatformViewsService.initSurfaceAndroidView(
			id: params.id,
			viewType: viewType,
			layoutDirection: TextDirection.ltr,
			creationParams: creationParams,
			creationParamsCodec: const StandardMessageCodec(),
			onFocus: () {
				params.onFocusChanged(true);
			},
			)
			..addOnPlatformViewCreatedListener(params.onPlatformViewCreated)
			..create();
		},
		viewType: viewType),
	);
}
```

### 虚拟模式

```dart
Widget build(BuildContext context) {
	const String viewType = '<platform-view-type>'; //托管页面标识
	final Map<String, dynamic> creationParams = <String, dynamic>{}; //传入原生页面的参数
	
	return Scaffold(
		body: return AndroidView(
			viewType: viewType,
			layoutDirection: TextDirection.ltr,
			creationParams: creationParams,
			creationParamsCodec: const StandardMessageCodec(),
		);,
	);
}
```


### 安卓原生代码

使用同一份安卓原生代码

```kotlin
package com.example.test  
  
import android.annotation.SuppressLint  
import android.content.Context  
import android.view.View  
import android.webkit.WebView  
import android.webkit.WebViewClient  
import io.flutter.plugin.platform.PlatformView  
  
@SuppressLint("SetTextI18n")  
internal class NativeView(context: Context, id: Int, creationParams: Map<String?, Any?>?): PlatformView {  
    private val webView: WebView  
  
    override fun getView(): View? {  
        return webView  
    }  
  
    override fun dispose() {  
        TODO("Not yet implemented")  
    }  
  
    init {  
        webView = WebView(context)  
        webView.webViewClient = object : WebViewClient() {  
            override fun shouldOverrideUrlLoading(view: WebView, url: String): Boolean {  
                view.loadUrl(url)  
                return true  
            }  
  
            override fun onPageFinished(view: WebView, url: String) {  
                super.onPageFinished(view, url)  
            }  
        }  
        webView.settings.apply {  
            useWideViewPort = true  
            loadWithOverviewMode = true  
            javaScriptEnabled = true  
            domStorageEnabled = true  
            allowContentAccess = true  
            allowFileAccess = true  
            setSupportZoom(true)  
  
        }  
  
        webView.loadUrl("https://m.zebanapp.com")  
    }  
}
```

## 总结

将 安卓原生 View 托管给 Flutter UI，能更好地使用实现原生功能。但另外一方面，将安卓原生 View 托管Flutter UI 必然会造成一些性能上的损失。更多缓解方法可以[参考](https://docs.flutter.dev/platform-integration/android/platform-views#performance)