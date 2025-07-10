<!-- prettier-ignore-start -->
# Interface: AppConfig

Defined in: [index.ts:35](https://github.com/windyeasy/asrv/blob/5a9660a0247bb8d58627252a61760ea755e2c446/src/types/index.ts#L35)

createApp配置信息，脚手架配置

## Properties

### $deps?

> `optional` **$deps**: `string`[]

Defined in: [index.ts:40](https://github.com/windyeasy/asrv/blob/5a9660a0247bb8d58627252a61760ea755e2c446/src/types/index.ts#L40)

依赖的其他文件，当其他文化变化时，会重新启动服务，当配置api过多时可以分模块定义

#### Example

```ts
['./src/app.ts', './src/*.js']
```

***

### enableHistory?

> `optional` **enableHistory**: `boolean`

Defined in: [index.ts:79](https://github.com/windyeasy/asrv/blob/5a9660a0247bb8d58627252a61760ea755e2c446/src/types/index.ts#L79)

是否开启json-server的history模式
- 默认开启

#### Default

```ts
true
```

***

### enableServer?

> `optional` **enableServer**: `boolean`

Defined in: [index.ts:55](https://github.com/windyeasy/asrv/blob/5a9660a0247bb8d58627252a61760ea755e2c446/src/types/index.ts#L55)

是否开启服务端
- 当接口地址与代理接口相同时，会使用本地定义的，所以设置这个值，可以关闭定义的接口

#### Default

```ts
true
```

***

### historyBlackList?

> `optional` **historyBlackList**: `string`[]

Defined in: [index.ts:84](https://github.com/windyeasy/asrv/blob/5a9660a0247bb8d58627252a61760ea755e2c446/src/types/index.ts#L84)

history模式黑名单，有些接口不需要记录历史，可以配置url
传入的会与默认的进行合并

***

### historyResHost?

> `optional` **historyResHost**: `string`

Defined in: [index.ts:89](https://github.com/windyeasy/asrv/blob/5a9660a0247bb8d58627252a61760ea755e2c446/src/types/index.ts#L89)

历史记录返回测试的host，如何想要返回的地址可以被局域网其它设备访问可以配置

#### Default

```ts
'localhost'
```

***

### logger?

> `optional` **logger**: `object`

Defined in: [index.ts:57](https://github.com/windyeasy/asrv/blob/5a9660a0247bb8d58627252a61760ea755e2c446/src/types/index.ts#L57)

#### enable?

> `optional` **enable**: `boolean`

是否开启日志记录，默认开启

##### Default

```ts
false
```

#### enableFile?

> `optional` **enableFile**: `boolean`

是否开启日志文件, 默认开启

##### Default

```ts
false
```

#### level?

> `optional` **level**: `"info"` \| `"warn"` \| `"error"`

日志级别

##### Default

```ts
info
```

***

### plugins?

> `optional` **plugins**: `PluginType`[]

Defined in: [index.ts:49](https://github.com/windyeasy/asrv/blob/5a9660a0247bb8d58627252a61760ea755e2c446/src/types/index.ts#L49)

插件

***

### port?

> `optional` **port**: `number`

Defined in: [index.ts:41](https://github.com/windyeasy/asrv/blob/5a9660a0247bb8d58627252a61760ea755e2c446/src/types/index.ts#L41)

***

### proxy?

> `optional` **proxy**: [`ProxyConfig`](ProxyConfig.md)

Defined in: [index.ts:45](https://github.com/windyeasy/asrv/blob/5a9660a0247bb8d58627252a61760ea755e2c446/src/types/index.ts#L45)

代理配置 - 与vite 配置一致

***

### server?

> `optional` **server**: `IServer`

Defined in: [index.ts:56](https://github.com/windyeasy/asrv/blob/5a9660a0247bb8d58627252a61760ea755e2c446/src/types/index.ts#L56)

***

### swaggerDeps?

> `optional` **swaggerDeps**: `string`[]

Defined in: [index.ts:93](https://github.com/windyeasy/asrv/blob/5a9660a0247bb8d58627252a61760ea755e2c446/src/types/index.ts#L93)

swagger依赖文件，自动解析注入不需要手动传入

<!-- prettier-ignore-end -->
