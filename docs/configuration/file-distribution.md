# 文件分发

服务器文件可以直接写入 `files`，也可以通过独立 JSON 索引批量维护。

## 直接声明文件

```json
{
  "path": ".minecraft/mods/example.jar",
  "sources": [
    "https://cdn.example.com/mods/example.jar",
    "https://server.example.com/client/mods/example.jar"
  ],
  "size": 123456,
  "hashAlgorithm": "SHA-256",
  "hash": "文件哈希",
  "policy": "MANAGED",
  "group": "mod"
}
```

下载器按照 `sources` 顺序尝试地址。路径必须位于游戏根目录内。

## 批量文件索引

服务器可以维护如下目录：

```text
overrides/
├─ mods/
│  ├─ mod-a.jar
│  └─ mod-b.jar
├─ config/
│  └─ example.toml
└─ resourcepacks/
```

生成索引：

```powershell
.\gradlew.bat :launcher-manifest-tools:run --args="index overrides files-index.json MANAGED"
```

工具会递归扫描文件，计算 SHA-256，并按路径排序输出。

客户端配置：

```json
{
  "fileIndexes": [
    {
      "url": "https://server.example.com/client/files-index.json",
      "baseUrl": "https://server.example.com/client/overrides/",
      "targetRoot": ".minecraft",
      "defaultPolicy": "MANAGED",
      "group": "server"
    }
  ]
}
```

索引条目中的绝对 URL、相对 `sources`、单个 `url` 和索引级 `baseUrl` 都可用于构造下载地址。

## 文件策略

| 策略 | 当前行为 |
| --- | --- |
| `MANAGED` | 缺失或哈希不符时下载；从新清单移除后删除旧受管文件 |
| `PRESERVE` | 缺失时下载，已存在后保留玩家修改 |
| `OPTIONAL` | 可结合 `required: false` 避免自动下载 |
| `EXCLUDED` | 不校验、不下载，也不作为当前受管文件 |

清理仅针对 `.matrixlauncher/installed-files.json` 中记录的旧 `MANAGED` 文件，不会扫描并删除玩家自行添加的 Mod、存档或截图。

## Config 文件

玩家可能修改的配置建议使用 `PRESERVE`：

```json
{
  "path": ".minecraft/config/example.toml",
  "sources": ["https://server.example.com/config/example.toml"],
  "size": 1024,
  "hashAlgorithm": "SHA-256",
  "hash": "文件哈希",
  "policy": "PRESERVE",
  "group": "config"
}
```

## ZIP 解压

文件设置 `extractTo` 后会在同步阶段解压：

```json
{
  "path": ".minecraft/versions/1.20.1/natives.zip",
  "sources": ["https://example.com/natives.zip"],
  "hashAlgorithm": "SHA-256",
  "hash": "文件哈希",
  "extractTo": ".minecraft/versions/1.20.1/natives"
}
```

解压前会清空目标目录，忽略 `META-INF/`，并阻止 ZIP 条目逃逸目标目录。
