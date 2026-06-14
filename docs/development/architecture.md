# 项目架构

MatrixLauncher 是 Gradle Kotlin DSL 多模块项目，各模块围绕稳定依赖方向拆分。

## 模块说明

| 模块 | 职责 |
| --- | --- |
| `launcher-api` | 品牌、主题、安全、Microsoft 配置和扩展接口 |
| `launcher-protocol` | Manifest、客户端配置和远程内容的序列化模型 |
| `launcher-core` | 元数据解析、校验、下载、同步、账号和启动逻辑 |
| `launcher-ui` | Compose Desktop 页面、组件、主题映射和 ViewModel |
| `launcher-app` | 组装网络客户端、核心与窗口，提供应用入口 |
| `launcher-manifest-tools` | 生成文件索引和 RSA-SHA256 签名 |
| `demo` | 可运行、可打包的定制示例 |

## 依赖关系

```text
demo
 ├─ launcher-app
 ├─ launcher-ui
 ├─ launcher-core
 ├─ launcher-api
 └─ launcher-protocol

launcher-app
 ├─ launcher-core
 ├─ launcher-ui
 └─ launcher-api

launcher-core
 ├─ launcher-api
 └─ launcher-protocol
```

`launcher-protocol` 不依赖 UI，适合与后端共享模型或作为协议实现参考。

## 应用组装

`AppFactory` 负责创建：

- Ktor OkHttp 客户端
- 本地或远程清单客户端
- 文件校验器与下载器
- 安装同步器与受管文件存储
- Java 解析器、命令构建器和进程启动服务
- 偏好设置与可选 Microsoft 登录服务
- 扩展上下文与 `LauncherEngine`

HTTP 客户端启用 HTTP/2、连接池、失败重试和超时控制。客户端配置中的并发数用于文件下载器。

## 核心接口

`LauncherController` 是 UI 与核心之间的边界，公开：

- `state`、`downloadSource`、`preferences` 和 `requiredJavaVersion`
- 下载源切换与偏好更新
- Java 安装检测
- Microsoft 登录
- `refresh`、`download` 和 `launch`

`LauncherViewModel` 将这些状态映射成 Compose 可使用的 `LauncherUiState`，并提供主要按钮行为。

## 安装计划生成

`ClientInstallPlanner` 会：

1. 获取 Mojang 版本清单和目标版本 JSON。
2. 根据操作系统规则选择 libraries 与 natives。
3. 获取 asset index 并加入全部资源对象。
4. 解析日志配置、JVM 参数和游戏参数。
5. 可选解析 Fabric profile 和 Maven 依赖。
6. 合并 `files` 与所有 `fileIndexes`。
7. 生成统一 `LauncherManifest`。

这使下载、校验和启动层无需区分文件来自 Mojang、Fabric 还是服务器。

## 测试范围

当前测试覆盖偏好存储、Manifest 签名验证、安装计划、安装同步、下载源路由、文件下载、Microsoft 登录和启动命令构建等核心行为。修改协议、路径处理、账号或下载逻辑时应同步增加回归测试。
