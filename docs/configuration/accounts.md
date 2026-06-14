# 账号与登录

MatrixLauncher 支持多个离线账号和 Microsoft 正版账号，并将账号列表保存在本地偏好文件中。

## 离线账号

离线玩家名必须为 3 至 16 位字母、数字或下划线：

```kotlin
val account = LauncherAccount.offline("Player_01")
```

默认偏好会创建名为 `Player` 的离线账号。离线 UUID 由标准 `OfflinePlayer:<name>` 规则生成。

## Microsoft 正版登录

启动器使用 OAuth 2.0 设备代码流程，不收集玩家密码，也不需要把 client secret 编译进客户端。

登录链路依次包括：

1. Microsoft 设备代码授权
2. Xbox Live 身份验证
3. XSTS 授权
4. Minecraft Services 登录
5. Java 版拥有权检查
6. Minecraft 角色档案读取

## 配置 Client ID

```kotlin
LauncherApplication.run(
    branding = MyBranding(),
    theme = MyTheme(),
    security = MySecurity.config,
    microsoftAuth = MicrosoftAuthConfig(
        clientId = "<Application client ID>"
    )
)
```

未传入 `microsoftAuth` 时，界面应隐藏或禁用 Microsoft 登录入口。

## 应用注册要求

在 Microsoft Entra 管理中心创建应用注册时：

- 支持的账号类型需要包含个人 Microsoft 账号
- 在身份验证高级设置中启用 public client flow
- 客户端只保存 Application (client) ID，不保存 secret

::: warning Xbox / Minecraft 授权
普通 Entra 应用注册不一定能直接访问 Xbox Live 与 Minecraft 登录服务。遇到 `Invalid app registration` 时，需要按 Microsoft 或 Xbox 的要求为自己的应用申请权限，不能复用其他启动器的 Client ID。
:::

## Token 存储与刷新

账号、access token、refresh token 与过期时间保存在：

```text
.matrixlauncher/launcher-config.json
```

启动正版账号前，若 access token 即将过期，核心会自动使用 refresh token 刷新。生产环境应限制该文件的本地访问权限，并向用户说明凭据存储方式。

## 用户偏好

同一文件还保存：

- 账号列表与当前选中账号
- Java 可执行文件路径
- 最大内存，允许范围为 1024 至 32768 MB
- 当前下载源

设置更新时必须至少保留一个账号，并选择一个有效账号。
