# 安全与 Manifest 签名

远程 Manifest 模式支持 RSA-SHA256 数字签名。客户端只嵌入公钥，私钥必须保留在服务端或受保护的发布环境。

## 生成密钥

```powershell
openssl genpkey -algorithm RSA -pkeyopt rsa_keygen_bits:3072 -out manifest-private.pem
openssl pkey -in manifest-private.pem -pubout -out manifest-public.pem
```

建议为每个生产客户或发布环境生成独立密钥对。

## 配置客户端公钥

```kotlin
object MySecurity {
    val config = LauncherSecurityConfig(
        manifestPublicKeyPem = """
            -----BEGIN PUBLIC KEY-----
            ...
            -----END PUBLIC KEY-----
        """.trimIndent(),
        requireSignedManifest = true
    )
}
```

仅在本地开发时可以关闭签名要求：

```kotlin
val security = LauncherSecurityConfig.unsignedForDevelopment()
```

不要把该设置用于生产客户端。

## 签名清单

```powershell
.\gradlew.bat :launcher-manifest-tools:run --args="sign manifest.json manifest-private.pem manifest.signed.json production-2026"
```

工具也兼容省略 `sign` 子命令的旧调用方式：

```powershell
.\gradlew.bat :launcher-manifest-tools:run --args="manifest.json manifest-private.pem manifest.signed.json production-2026"
```

输出会加入：

```json
{
  "signature": {
    "algorithm": "SHA256withRSA",
    "value": "<Base64>",
    "keyId": "production-2026"
  }
}
```

## 签名规则

签名载荷由清单移除顶层 `signature` 后生成。JSON 对象键按字典序规范化，数组元素顺序不变。服务端应直接返回工具生成的文件，避免经过会改变语义或数值表示的二次转换。

## 安全边界

数字签名可以帮助发现清单被篡改，但不能让 JVM 客户端绝对不可逆向。以下内容不能放进客户端：

- Manifest 私钥
- 代码签名 PFX 与密码
- 服务端管理凭据
- 能绕过后端权限判断的固定密钥

关键授权、付费权益和管理操作必须由服务端执行。文件索引当前没有独立签名，生产环境至少应通过 HTTPS 提供。
