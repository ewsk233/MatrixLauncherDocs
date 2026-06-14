# 客户端配置

客户端配置模式把稳定配置编译进启动器，由客户端自动解析 Mojang 与 Fabric 元数据。

## 启用方式

```kotlin
LauncherApplication.run(
    branding = MyBranding(),
    theme = MyTheme(),
    security = MySecurity.config,
    clientProfileResourcePath = "/client-profile.json"
)
```

## 完整示例

```json
{
  "profileVersion": 1,
  "clientId": "my-server-client",
  "clientVersion": "1.0.0",
  "minecraft": {
    "version": "1.20.1"
  },
  "loader": {
    "type": "fabric",
    "version": "0.15.11"
  },
  "server": {
    "name": "My Server",
    "address": "mc.example.com",
    "port": 25565
  },
  "download": {
    "defaultSource": "BMCLAPI",
    "availableSources": ["BMCLAPI", "OFFICIAL"],
    "maxConcurrentDownloads": 8
  },
  "files": [],
  "fileIndexes": [
    {
      "url": "https://launcher.example.com/files-index.json",
      "baseUrl": "https://launcher.example.com/overrides/",
      "targetRoot": ".minecraft",
      "defaultPolicy": "MANAGED",
      "group": "server"
    }
  ],
  "launch": {
    "playerName": "Player",
    "minMemoryMb": 1024,
    "maxMemoryMb": 4096,
    "gameArgs": [
      "--server",
      "{serverAddress}",
      "--port",
      "{serverPort}"
    ]
  }
}
```

## 顶层字段

| 字段 | 说明 |
| --- | --- |
| `profileVersion` | 配置格式版本，默认 `1` |
| `clientId` | 客户端产品标识 |
| `clientVersion` | 客户端发布版本 |
| `minecraft` | Minecraft 版本与元数据地址 |
| `loader` | 可选 Loader；当前仅支持 `fabric` |
| `server` | 服务器名称、地址与端口 |
| `announcement` | 可选的内置公告 |
| `download` | 下载源与并发数 |
| `files` | 直接声明的自定义文件 |
| `fileIndexes` | 外部批量文件索引 |
| `launch` | 默认玩家、Java、内存和附加参数 |

## 自动解析内容

启动器会从 Mojang 元数据自动加入：

- 版本 JSON 与客户端 JAR
- Java 依赖库和当前平台 natives
- asset index 与全部资源对象
- 日志配置和版本要求的启动参数

配置 Fabric 时，还会从 Fabric Meta API 和 Maven 解析 Loader、Intermediary、Mixin、ASM 等依赖，并替换 main class。

## 启动字段

`launch` 可设置：

| 字段 | 默认值 | 说明 |
| --- | --- | --- |
| `playerName` | `Player` | 初始离线玩家名 |
| `playerUuid` | 自动生成 | 可选的固定离线 UUID |
| `accessToken` | `0` | 低层默认 token，实际启动会使用选中账号 |
| `minMemoryMb` | `1024` | 最小堆内存 |
| `maxMemoryMb` | `4096` | 最大堆内存 |
| `javaPath` | 空 | 指定 Java 可执行文件 |
| `javaArgs` | 空数组 | 附加 JVM 参数 |
| `gameArgs` | 空数组 | 附加游戏参数 |

用户界面保存的 Java 路径和最大内存会在启动时覆盖配置默认值。

## 注意事项

- 当前 Loader 自动解析仅支持 Fabric。
- `versionManifestUrl` 和 `assetObjectBaseUrl` 可覆盖，但通常不需要修改。
- 发布时应使用 HTTPS 提供文件索引与自定义文件。
- `clientVersion` 变化不会自动替代文件哈希校验，文件列表仍应准确。
