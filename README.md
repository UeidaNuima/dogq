# dogq

[![npm version](https://badge.fury.io/js/dogq.svg)](https://badge.fury.io/js/dogq)
[![Dependencies](https://david-dm.org/moondropx/dogq.svg)](https://david-dm.org/moondropx/dogq)

一个 Koa 风格的 node 用 qq bot framework 。需要配合[CQSocketAPI](https://github.com/yukixz/cqsocketapi)使用。

## Installation

```
$ yarn add dogq
```

or

```
$ npm install dogq
```

## Usage

```javascript
const Bot = require('dogq');

const bot = new Bot();

bot.use(async (ctx, next) => {
  ctx.bot.logger.info('Message received.');
  await next();
  ctx.bot.logger.info('Message replied.');
});

bot.use(ctx => {
  ctx.reply('Hello dogq!');
});

bot.start();
```

## API

### Bot

bot 主类，控制 bot 的行为。

#### constructor(config?: object)

`config`接受以下参数：

- `targetServerPort?: number`: CQSocketAPI 提供的端口，默认为`11235`。
- `selfServerPort?: number`: bot 自身服务器端口，默认为`12450`。
- `logLevel?: Level`: 打印日志级别，默认为`Level.INFO`。可以取：
  - `Level.ALL` (0)
  - `Level.DEBUG` (1)
  - `Level.INFO` (2)
  - `Level.WARN` (3)
  - `Level.ERROR` (4)
  - `Level.OFF` (5)
- `debug?: boolean`: 设置调试模式，会将`logLevel`强制设置为`Level.DEBUG`并且会将所有的发送消息打印至控制台而不发送。

#### start()

运行 bot，监听消息。

#### use(middleware: (ctx: Context, next: () => Promise<any>) => void)

增加一个中间件。中间件的概念参考`Koa`。

#### on(matcher: object, middleware: (ctx: Context, next: () => Promise<any>) => void)

使用给定的中间件对对应符合条件的消息进行响应。

`matcher`接受以下参数：

- `type?: string|RegExp`: 可取`RecvPrivateMessage|RecvGroupMessage|RecvDiscussMessage|RecvGroupMemberDecrease|RecvGroupMemberIncrease|RecvUnknownMessage`，分别为接收到的消息种类。
- `QQ?: string|RegExp`: 若有发送者，为发送者的 QQ。
- `group?: string|RegExp`: 若是群组消息，为消息来源群组。
- `discuss?: string|RegExp`: 若是讨论组消息，为消息来源讨论组。
- `operatedQQ?: string|RegExp`: 若为操作消息，为操作的对象的 QQ。
- `text?: string|RegExp`: 若有消息内容，为消息内容。

每一条规则都接受`string`与`RegExp`两种格式。若对`text`使用`RegExp`，后面中间件收到的`ctx`将会多一个`match`属性，为匹配结果。

#### send(message: SendMessage)

向服务器发送一条消息。

`SendMessage`的具体格式可以参考`src/cqsdk.ts`。

```typescript
// 私聊消息
interface SendPrivateMessage {
  type: 'SendPrivateMessage';
  QQ: string;
  text: string;
}

// 群组消息
interface SendGroupMessage {
  type: 'SendGroupMessage';
  group: string;
  text: string;
}

// 讨论组消息
interface SendDiscussMessage {
  type: 'SendDiscussMessage';
  discuss: string;
  text: string;
}
```

#### logger: Logger

日志打印类的实例。

#### context: { [k: string]: any }

上下文初始化对象，该对象的成员都会作为额外的参数传入所有中间件的`ctx`中。

### Middleware: (ctx: Context, next: () => Promise<any>) => void

`use`与`on`方法接受的中间件，传入的中间件会以洋葱的方式执行，具体概念参考`Koa`。同时接受`async`方式的异步函数与普通函数。

```javascript
bot.use(async (ctx, next) => {
  console.log(1);
  await next();
  console.log(2);
});

bot.use((ctx, next) => {
  console.log(3);
  next().then(() => {
    console.log(4);
  });

  console.log(5);
});

bot.use((ctx, next) => {
  console.log(6);
});

// will be 135642
```

### Context

作为中间件函数的第一个参数的上下文对象。

#### reply(text: string)

对消息进行回复。只能回复私聊消息、群组消息、讨论组消息。

#### bot: Bot

Bot 对象的实例。

#### message: RecvMessage

接收到的消息，具体格式可以参考`src/cqsdk.ts`。

```typescript
// 私聊消息
interface RecvPrivateMessage {
  type: 'RecvPrivateMessage';
  QQ: string; // 发送消息对象的QQ
  text: string; // 内容
  message: string; // 解码前的原始消息
}

// 群组消息
interface RecvGroupMessage {
  type: 'RecvGroupMessage';
  QQ: string;
  group: string; // 消息来源群组
  text: string;
  message: string;
}

// 讨论组消息
interface RecvDiscussMessage {
  type: 'RecvDiscussMessage';
  QQ: string;
  discuss: string; // 消息来源讨论组
  text: string;
  message: string;
}
```

#### match: any[]

当使用`on`方法传入中间件并且`text`为正则表达式时的匹配结果。数组中第一个元素为完整匹配的`string`，后续元素分别为捕获的分组。

### Logger

向控制台打印格式化日志所用的类。

#### debug(message: string | number)

#### info(message: string | number)

#### warn(message: string | number)

#### error(message: string | number)

#### log(level: Level, message: string | number)

打印不同日志级别的日志。

## Typescript

使用`typescript`编写并且导出了对应`.d.ts`。使用`typescript`的例子参见 https://github.com/moondropx/dogbot-node。

## Licence

WTFPL
