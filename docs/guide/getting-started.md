# 快速开始

本页从源码运行 Demo，并说明如何创建自己的启动器入口。

## 环境要求

- JDK 17 或更高版本
- Windows、Linux 或 macOS 开发环境
- 项目自带 Gradle Wrapper，无需单独安装 Gradle
- 原生安装包示例当前配置为 Windows MSI

## 获取并构建

在 MatrixLauncher 源码根目录执行：

```powershell
.\gradlew.bat build
```

Linux 或 macOS：

```bash
./gradlew build
```

构建会编译所有模块并运行测试。首次执行需要下载 Gradle、Kotlin、Compose 和 Ktor 等依赖。

## 运行 Demo

```powershell
.\gradlew.bat :demo:run
```

Demo 使用以下资源和入口：

| 内容 | 路径 |
| --- | --- |
| 应用入口 | `demo/src/main/kotlin/cn/matrixmc/matrixlauncher/demo/Main.kt` |
| 客户端配置 | `demo/src/main/resources/client-profile.json` |
| Logo、背景、图标 | `demo/src/main/resources/branding/` |
| 自定义页面 | `demo/src/main/kotlin/cn/matrixmc/matrixlauncher/demo/DemoLauncherScreen.kt` |

示例配置里的服务器地址与网站地址是占位值，文件索引默认请求本机 `http://localhost:8080`。没有启动配套后端时，远程内容或文件索引请求可能失败。

## 创建启动器入口

在应用模块中实现品牌、主题和安全配置，然后调用 `LauncherApplication.run`：

```kotlin
fun main() {
    LauncherApplication.run(
        branding = MyBranding(),
        theme = MyTheme(),
        security = MySecurity.config,
        clientProfileResourcePath = "/client-profile.json",
        extensions = emptyList()
    )
}
```

`clientProfileResourcePath` 指向 classpath 内的 JSON。使用这一参数时，启动器会自动解析 Minecraft 与 Fabric 元数据；不传入时则切换到远程 Manifest 模式。

## 推荐的首次定制顺序

1. 复制 `demo` 模块，修改包名和应用入口。
2. 替换 `branding/` 下的 Logo、背景与 Windows 图标。
3. 修改 `LauncherBranding` 的名称、网站和 API 地址。
4. 调整 `client-profile.json` 的游戏版本、Loader、服务器和文件索引。
5. 生成自己的 RSA 密钥对并替换示例公钥。
6. 修改 MSI 包名、版本和固定的 Upgrade UUID。
7. 使用真实环境完整验证检查更新、下载、登录和启动。

## 下一步

- [理解启动器的状态与目录](/guide/core-concepts)
- [配置 Minecraft、Fabric 与服务器](/configuration/client-profile)
- [定制品牌和 Compose 页面](/configuration/branding-ui)
- [构建 Windows 安装包](/deployment/build-release)
