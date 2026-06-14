# 限制与路线图

MatrixLauncher 当前处于早期开发阶段。以下内容用于明确现有边界，避免在生产设计中依赖尚未完成的行为。

## 已实现

- Compose Desktop 启动器窗口与可替换页面
- 品牌、主题、窗口和 UI 组件定制
- Mojang 原版客户端、libraries、assets、natives 和日志配置解析
- Fabric Loader profile 与 Maven 依赖解析
- SHA-1 / SHA-256 文件校验
- 并发下载、多地址回退与 BMCLAPI 路由
- 文件索引、受管文件清理与 ZIP 安全解压
- 离线账号、Microsoft 设备代码登录与 token 刷新
- Java 检测、启动命令构建与外部进程启动
- Manifest RSA-SHA256 验证
- Windows MSI、ProGuard 与 Authenticode 任务
- 扩展生命周期

## 尚未完成

- Forge、NeoForge 和 Quilt 元数据与安装流程
- Forge / NeoForge installer processors
- Java 运行时自动下载和安装
- 下载断点续传与单文件分片下载
- `OPTIONAL` 文件的图形化选择页面
- 文件索引的独立数字签名
- `UpdatePolicyDto.allowSkipUpdate` 的完整执行逻辑
- `UpdatePolicyDto.deleteUnknownFiles` 的全目录清理逻辑
- 通用版本管理、实例管理和整合包市场

## 当前行为说明

- 远程轮播内容不可用时应回退内置内容，不阻止游戏更新与启动。
- 远程 Manifest 可以携带 `announcement`，但实际展示取决于所使用的页面。
- Java 版本要求会展示和参与选择，但缺少合适 Java 时不会自动下载。
- 并发下载表示同时下载多个文件，单个大文件仍为单连接流式下载。
- `PRESERVE` 与受管记录用于保护玩家修改；不要开启尚未实现的“删除未知文件”预期。

## 生产使用建议

在正式发布前，至少完成以下验证：

1. 为目标 Minecraft 与 Fabric 版本建立固定回归样例。
2. 在支持的每个操作系统和架构上验证 natives。
3. 通过 HTTPS 分发 Manifest、索引和文件。
4. 使用独立生产密钥签名 Manifest。
5. 对 token 本地存储、隐私说明和日志脱敏进行安全评审。
6. 为后端不可用、镜像失败、磁盘不足和损坏下载设计用户提示。
7. 建立安装包升级、回滚和旧受管文件清理测试。
