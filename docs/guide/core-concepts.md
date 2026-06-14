# 核心概念

## 工作流程

启动器的主流程由 `LauncherEngine` 管理：

```text
启动应用
  -> 获取或生成 Manifest
  -> 校验本地文件
  -> 下载缺失或哈希不匹配的文件
  -> 再次校验
  -> 清理过期的受管文件并解压 natives
  -> 解析账号、Java 与内存设置
  -> 构建命令并启动 Minecraft
```

扩展可以在获取清单、校验、下载和启动等节点前后执行逻辑。

## 状态模型

UI 通过 `LauncherController.state` 订阅 `StateFlow<LauncherState>`：

| 状态 | 含义 |
| --- | --- |
| `Idle` | 尚未检查更新 |
| `FetchingManifest` | 正在获取或生成清单 |
| `CheckingFiles` | 正在校验本地文件 |
| `NeedDownload` | 存在缺失或损坏文件 |
| `Downloading` | 正在下载，并提供字节数和进度 |
| `Ready` | 文件完整，可以启动 |
| `Launching` | 正在创建 Minecraft 进程 |
| `Error` | 流程失败，包含错误信息 |

切换下载源会使当前安装计划失效，用户应重新检查更新。

## 工作目录

默认数据保存在启动器当前工作目录下：

```text
.matrixlauncher/
├─ game/                    # 游戏根目录
│  └─ .minecraft/          # Minecraft 工作目录
├─ launcher-config.json    # 账号、Java、内存和下载源偏好
├─ installed-files.json    # 上一次安装的受管文件记录
└─ cache/content/          # 远程轮播图缓存
```

配置中的文件路径相对于 `.matrixlauncher/game/` 解析。核心会阻止路径逃逸到游戏目录之外，ZIP 解压也会检查条目路径。

## 安装计划

无论使用客户端配置还是远程 Manifest，核心最终都会得到一个 `LauncherManifest`。其中包含：

- 客户端与游戏版本
- 服务器地址
- 文件列表和校验信息
- main class、classpath、JVM 参数和游戏参数
- Java 版本要求
- 更新策略和可选签名

客户端配置模式只是自动生成这份 Manifest 的便捷方式。

## 下载源

当前内置两种来源：

- `BMCLAPI`：优先将 Mojang 与 Fabric URL 转换为国内镜像，失败后回退官方地址。
- `OFFICIAL`：直接使用 Mojang 与 Fabric 官方地址。

自定义服务端文件不做固定域名转换，而是按照 `sources` 中的顺序依次尝试。

## 账号与启动参数

用户设置中的选中账号会在启动前注入 Minecraft 参数。离线账号使用离线 UUID；Microsoft 账号使用 Minecraft Services 返回的 UUID 与 access token。启动器还会把用户选择的 Java 路径和最大内存覆盖到最终启动请求中。
