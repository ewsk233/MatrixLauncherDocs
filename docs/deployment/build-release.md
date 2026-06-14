# 构建与发布

## 常用任务

```powershell
# 构建全部模块并运行测试
.\gradlew.bat build

# 运行 Demo
.\gradlew.bat :demo:run

# 清理构建目录
.\gradlew.bat clean
```

## Windows MSI

开发构建：

```powershell
.\gradlew.bat :demo:packageMsi
```

产物位于：

```text
demo/build/compose/binaries/main/msi/
```

Release 构建会启用 Compose Desktop ProGuard：

```powershell
.\gradlew.bat :demo:proguardReleaseJars
.\gradlew.bat :demo:packageReleaseMsi
```

产物位于：

```text
demo/build/compose/binaries/main-release/msi/
```

## 包信息

在 `demo/build.gradle.kts` 修改：

```kotlin
val releasePackageName = "MyLauncher"
val releasePackageVersion = "1.0.0"
val windowsUpgradeUuid = "固定的 UUID"
```

::: danger Upgrade UUID
产品首次发布后不要修改 `windowsUpgradeUuid`。每次发布新 MSI 都应递增 `releasePackageVersion`，否则 Windows Installer 可能把重打包文件视为冲突产品。
:::

还应修改菜单组、图标、包名和应用代码中的品牌信息。

## ProGuard

Release 规则位于：

```text
demo/compose-desktop.pro
```

混淆会提高逆向成本，但不能保护客户端内的秘密。发布前需要验证序列化模型、Compose 页面、反射使用和应用入口没有被错误裁剪。

## Authenticode 签名

发布机需要 Windows SDK 和有效的代码签名证书：

```powershell
$env:MATRIX_SIGNTOOL = "C:\Program Files (x86)\Windows Kits\10\bin\<版本>\x64\signtool.exe"
$env:MATRIX_CODESIGN_PFX = "D:\secrets\codesign.pfx"
$env:MATRIX_CODESIGN_PASSWORD = "<由 CI Secret 注入>"
$env:MATRIX_TIMESTAMP_URL = "http://timestamp.digicert.com"
```

构建并签名：

```powershell
.\gradlew.bat :demo:signReleasePackages
```

验证签名：

```powershell
.\gradlew.bat :demo:verifySignedReleasePackages
```

任务使用 SHA-256 文件摘要和 RFC 3161 SHA-256 时间戳。不要把 PFX 或密码提交到仓库。

## 发布检查

1. 替换所有示例域名、Client ID、公钥和品牌素材。
2. 在干净用户目录测试首次安装、更新和卸载。
3. 分别测试官方源和镜像源。
4. 验证离线账号、正版登录、token 刷新和多账号切换。
5. 验证旧受管文件清理不会影响玩家自定义文件。
6. 使用目标 Java 版本启动实际客户端。
7. 检查 MSI 和远程 Manifest 签名。
