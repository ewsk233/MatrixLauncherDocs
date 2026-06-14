# 品牌与界面

MatrixLauncher 将品牌数据、设计令牌和顶层 Compose 页面分开，既能快速换肤，也能完全重做界面。

## 品牌配置

实现 `LauncherBranding`：

```kotlin
class MyBranding : LauncherBranding {
    override val appName = "My Server 启动器"
    override val windowTitle = "My Server Launcher"
    override val apiBaseUrl = "https://launcher.example.com"
    override val logoPath = "/branding/logo.png"
    override val backgroundPath = "/branding/background.jpg"
    override val iconPath = "/branding/icon.ico"
    override val supportUrl = "https://example.com/support"
    override val officialWebsite = "https://example.com"
}
```

素材通常放在应用模块的 `src/main/resources/branding/`。路径以 classpath 根目录为基准。

## 主题配置

实现 `LauncherTheme` 可控制：

- 主色、背景、表面、文本和状态颜色
- 小、中、大、按钮和卡片圆角
- 默认字体与标题、正文、按钮字号
- 五级页面间距

颜色使用 `#RRGGBB` 或 Compose 映射器支持的格式。可直接参考 Demo 的 `DemoTheme.kt`。

## 窗口参数

`LauncherApplication.run` 提供：

```kotlin
LauncherApplication.run(
    branding = MyBranding(),
    theme = MyTheme(),
    security = MySecurity.config,
    undecorated = true,
    transparent = false,
    resizable = false,
    windowWidth = 1008.dp,
    windowHeight = 610.dp
)
```

无边框窗口需要在自定义页面中提供拖动、最小化与关闭交互。

## 自定义顶层页面

传入 `content` 可替换默认 `MatrixLauncherWindow`：

```kotlin
@Composable
fun MyCustomerScreen(
    branding: LauncherBranding,
    viewModel: LauncherViewModel
) {
    LauncherScaffold(backgroundPath = branding.backgroundPath) {
        LauncherActionPanel(
            state = viewModel.uiState,
            onAction = viewModel::onMainButtonClick
        )
    }
}

fun main() {
    LauncherApplication.run(
        branding = MyBranding(),
        theme = MyTheme(),
        security = MySecurity.config,
        content = ::MyCustomerScreen
    )
}
```

## 可复用 UI 组件

`launcher-ui` 当前提供：

- `LauncherScaffold`
- `GlassPanel`
- `LauncherCenterPanel`
- `LauncherActionPanel`
- `AnnouncementPanel`
- `BrandHeader`
- `StartButton`
- `DownloadProgressBar`
- `DownloadSourceSelector`
- `LaunchFeedbackIndicator`

页面通过 `LauncherViewModel` 获取状态、下载源、偏好设置、Microsoft 登录和主要操作。客户界面与素材会编译进应用，不依赖运行时下载布局文件。
