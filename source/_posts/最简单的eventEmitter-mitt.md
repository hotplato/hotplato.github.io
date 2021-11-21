---
title: 最简单的eventEmitter-mitt
date: 2021-11-11 13:53:00
tags: [javascript,typescript]
excerpt: 发布/订阅模式比较常用设计模式，今天给大家带来一个仅有200b的EventEmitter的mitt。
---
[发布/订阅模式](https://zh.wikipedia.org/wiki/%E5%8F%91%E5%B8%83/%E8%AE%A2%E9%98%85)比较常用设计模式，今天给大家带来一个仅有200b的EventEmitter的[mitt](https://github.com/developit/mitt)。


### 记录

``` typescript
export type EventType = string | symbol;
export type Handler<T = unknown> = (event: T) => void;
export type EventHandlerMap<Events extends Record<EventType, unknown>> = Map<
	keyof Events | '*',
	EventHandlerList<Events[keyof Events]> | WildCardEventHandlerList<Events>
>;
//记录所有订阅的事件
//key -> string, handler ->
//all 外部传入，类型 EventHandlerMap
all = all || new Map() 
```

更多信息: [typescript](https://www.typescriptlang.org/docs/)

### 订阅

``` typescript
export type WildcardHandler<T = Record<string, unknown>> = (
	type: keyof T,
	event: T[keyof T]
) => void;

type GenericEventHandler = | Handler<Events[keyof Events]> | WildcardHandler<Events>;

on<Key extends keyof Events>(type: Key, handler: GenericEventHandler) {
	const handlers: Array<GenericEventHandler> | undefined = all!.get(type);
		if (handlers) {
			handlers.push(handler);
		}else {
			all!.set(type, [handler] as EventHandlerList<Events[keyof Events]>);
		}
},
```
on方法接受type和handler两个参数，其中接收一个订阅名称(type)，和一个handler函数

### 取消订阅

``` typescript
off<Key extends keyof Events>(type: Key, handler?: GenericEventHandler) {
	const handlers: Array<GenericEventHandler> | undefined = all!.get(type);
		if (handlers) {
            // 判断是否存在该handler，否则清空所有订阅type的事件
			if (handler) {
					handlers.splice(handlers.indexOf(handler) >>> 0, 1);
			}
			else {
				all!.set(type, []);
			}
		}
},
```
off方法接受type和handler两个参数，其中接收一个订阅名称(type)，和一个可选的handler函数，

### 发布

``` typescript
emit<Key extends keyof Events>(type: Key, evt?: Events[Key]) {
    // 通过type查看订阅type的事件
	let handlers = all!.get(type);
	if (handlers) {
		(handlers as EventHandlerList<Events[keyof Events]>)
			.slice()
			.map((handler) => {
			    handler(evt!);
		});
	}

    // 查找*（所有事件）
	handlers = all!.get('*');
	if (handlers) {
		(handlers as WildCardEventHandlerList<Events>)
			.slice()
			.map((handler) => {
					handler(type, evt!);
			});
	}
}
```
emit方法接受type和evt两个参数，其中接收一个订阅名称(type)，和一个可选的evt参数，


## 结束

以上就是就是mitt的全部实现