# 扩展开发

扩展适合在启动生命周期中执行附加逻辑，例如写入默认配置、记录遥测、准备环境或响应启动失败。

## 创建扩展

```kotlin
class MyExtension : LauncherExtension {
    override val id = "my-extension"

    override fun onLauncherInit(context: ExtensionContext) {
        println("初始化 ${context.branding.appName}")
    }

    override fun onBeforeLaunch(context: ExtensionContext) {
        val options = context.gameDirectory.resolve(".minecraft/options.txt")
        // 在启动前准备文件
    }

    override fun onLaunchFailed(
        context: ExtensionContext,
        throwable: Throwable
    ) {
        throwable.printStackTrace()
    }
}
```

注册：

```kotlin
LauncherApplication.run(
    branding = MyBranding(),
    theme = MyTheme(),
    security = MySecurity.config,
    extensions = listOf(MyExtension())
)
```

## 生命周期

| 回调 | 时机 |
| --- | --- |
| `onLauncherInit` | Engine 创建完成 |
| `onBeforeFetchManifest` | 获取或生成清单之前 |
| `onAfterFetchManifest` | 清单可用之后 |
| `onBeforeVerify` | 文件校验之前 |
| `onAfterVerify` | 文件校验之后 |
| `onBeforeDownload` | 下载之前 |
| `onAfterDownload` | 下载完成之后 |
| `onBeforeLaunch` | 构建命令并启动之前 |
| `onAfterLaunch` | 进程成功创建且通过短时存活检查之后 |
| `onLaunchFailed` | 启动过程抛错或返回失败 |

下载流程可能再次触发校验回调。

## ExtensionContext

上下文提供：

| 属性 | 内容 |
| --- | --- |
| `branding` | 当前 `LauncherBranding` |
| `launcherDirectory` | 启动器工作目录的绝对路径 |
| `gameDirectory` | `.matrixlauncher/game` 的绝对路径 |

## 设计建议

- 回调当前是同步函数，避免在其中执行长时间阻塞操作。
- 写文件时始终基于上下文路径解析，并自行限制路径范围。
- 扩展异常会中断对应启动流程，应只在确实无法继续时抛错。
- 不要在扩展中嵌入私钥或服务端管理凭据。
- 与核心状态紧密相关的新能力更适合进入正式模块，而不是通过扩展绕过控制器。

Demo 的 `DemoExtension` 展示了如何在启动前为 `options.txt` 写入默认中文语言。
