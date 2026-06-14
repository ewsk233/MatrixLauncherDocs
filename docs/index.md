---
layout: home

hero:
  name: MatrixLauncher
  text: Minecraft 服务器定制启动器框架
  tagline: 使用 Kotlin 与 Compose Desktop 构建品牌化客户端，完成游戏文件解析、校验、下载、账号管理与启动。
  actions:
    - theme: brand
      text: 快速开始
      link: /guide/getting-started
    - theme: alt
      text: 查看架构
      link: /development/architecture

features:
  - icon: 🎨
    title: 品牌与界面可定制
    details: 替换名称、Logo、背景、窗口参数与主题，也可以直接提供完整的 Compose 页面。
  - icon: 📦
    title: 自动生成安装计划
    details: 从 Mojang 与 Fabric 元数据解析客户端、依赖库、资源、原生库和启动参数。
  - icon: 🔍
    title: 文件校验与同步
    details: 支持 SHA-1、SHA-256、多下载源、并发下载、受管文件清理与 ZIP 安全解压。
  - icon: 👤
    title: 离线与正版账号
    details: 管理多个离线账号，并通过 Microsoft 设备代码流程登录正版 Minecraft Java 版账号。
  - icon: 🔐
    title: Manifest 数字签名
    details: 使用 RSA-SHA256 验证远程启动清单，降低客户端配置被篡改的风险。
  - icon: 🧩
    title: 模块化与扩展生命周期
    details: 核心、协议、UI、应用组装和工具彼此分离，并提供启动流程扩展钩子。
---

## MatrixLauncher 是什么

MatrixLauncher 是一套面向 **Minecraft 服务器专属客户端** 的启动器 SDK 与示例应用。它不以管理任意游戏版本和整合包为目标，而是帮助服务器团队制作一款具有独立品牌、固定客户端配置和受控更新流程的桌面启动器。

启动器可以将 Minecraft 版本、Fabric Loader、服务端 Mod、配置文件和资源包组合成统一安装计划，随后完成本地校验、缺失文件下载、旧受管文件清理、Java 命令构建和游戏进程启动。

## 适用场景

- 为单个服务器或服务器网络制作专属启动器
- 将客户端版本与服务器 Mod、Config、资源包保持同步
- 提供国内镜像与官方源切换，改善玩家下载体验
- 使用 Compose Desktop 制作完全独立的品牌界面
- 通过签名清单控制远程客户端发布

## 两种配置模式

| 模式 | 配置来源 | 适合场景 |
| --- | --- | --- |
| 客户端配置 | 编译进应用的 `client-profile.json` | 大多数固定版本服务器；自动解析 Mojang 与 Fabric 元数据 |
| 远程 Manifest | `GET /api/launcher/manifest` | 后端完全生成文件列表、classpath 与启动参数的场景 |

建议先从[客户端配置](/configuration/client-profile)模式开始。它需要维护的字段更少，并能自动构造原版与 Fabric 所需文件。

## 当前状态

项目处于早期开发阶段，核心的检查、下载和启动链路已经实现。Fabric 可用；Forge、NeoForge、Quilt、Java 自动下载、断点续传和可选文件选择界面仍未完成。发布前请阅读[限制与路线图](/development/limitations)。
