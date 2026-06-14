# 远程 Manifest

不传入 `clientProfileResourcePath` 时，启动器请求：

```text
GET {apiBaseUrl}/api/launcher/manifest
```

后端必须返回与 `LauncherManifest` 对应的 JSON。此模式适合由服务端完全控制文件列表和启动参数的系统。

## 最小示例

```json
{
  "manifestVersion": 1,
  "clientId": "my-server",
  "clientVersion": "1.0.0",
  "gameVersion": "1.20.1",
  "server": {
    "name": "My Server",
    "address": "mc.example.com",
    "port": 25565
  },
  "files": [
    {
      "path": ".minecraft/client.jar",
      "sources": ["https://cdn.example.com/client.jar"],
      "size": 12345678,
      "hashAlgorithm": "SHA-256",
      "hash": "填写文件哈希",
      "policy": "MANAGED",
      "group": "client"
    }
  ],
  "launch": {
    "mainClass": "net.minecraft.client.main.Main",
    "classpath": [".minecraft/client.jar"],
    "requiredJavaVersion": 17,
    "javaArgs": ["-Dfile.encoding=UTF-8"],
    "gameArgs": [
      "--gameDir", "{gameDir}/.minecraft",
      "--server", "{serverAddress}",
      "--port", "{serverPort}"
    ],
    "minMemoryMb": 1024,
    "maxMemoryMb": 4096,
    "workingDirectory": ".minecraft"
  },
  "signature": {
    "algorithm": "SHA256withRSA",
    "value": "Base64 编码的签名",
    "keyId": "production-2026"
  }
}
```

## 文件字段

`RemoteFileDto` 同时兼容旧字段 `url`、`sha256` 和新字段 `sources`、`hashAlgorithm`、`hash`。新项目建议使用后者。

| 字段 | 说明 |
| --- | --- |
| `path` | 相对于游戏根目录的目标路径 |
| `sources` | 按顺序尝试的下载 URL |
| `size` | 文件字节数，用于进度计算 |
| `hashAlgorithm` | `SHA-1`、`SHA-256` 或 `NONE` |
| `hash` | 期望哈希 |
| `required` | 是否为必需文件 |
| `policy` | `MANAGED`、`PRESERVE`、`OPTIONAL` 或 `EXCLUDED` |
| `group` | 业务分组标签 |
| `extractTo` | 下载后解压到的相对目录 |

## 启动占位符

远程 Manifest 的 `gameArgs` 当前支持：

| 占位符 | 替换内容 |
| --- | --- |
| `{gameDir}` | `.matrixlauncher/game` 的绝对路径 |
| `{serverAddress}` | 服务器地址 |
| `{serverPort}` | 服务器端口 |

账号相关的标准 Minecraft 参数由启动命令构建器结合用户设置处理。

## 签名要求

生产环境建议保持 `requireSignedManifest = true`。签名覆盖移除顶层 `signature` 后的规范化 JSON；对象键按字典序排列，数组顺序保持不变。签名生成方式见[安全与签名](/security/manifest-signing)。
