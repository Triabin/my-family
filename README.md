# 电子族谱

逢年过节，不知道七大姑八大姨如何称呼？整一个赛博族谱，年轻人的电子家谱。

## 技术栈

- 前端：vite7+vue3+typescript
- 后端：express+typescript+sqlite3
- 部署：docker

## 目录结构

```text
my-family
├── README.md
├── package.json
├── server  // 后端代码
└── front   // 前端代码
```

## 环境变量

`PORT`：可选，服务端口，默认3000

`FAMILY_NAME`：必填，家族姓氏

`DB_FILE_NAME`: 可选，sqlite数据库文件路径，默认`file:../my-family.db`

`DB_PASSWORD`：可选，sqlite数据库密码，默认空

`LOG_DIR`：可选，日志存储目录，默认`../logs`

`LOG_LEVEL`：可选，日志级别，默认`info`

`JWT_SECRET`：必填，JWT加密密钥
  - Windows端，使用powershell生成随机字符串：`[Convert]::ToBase64String((1..64 | ForEach-Object { Get-Random -Maximum 256 }))`
  - Linux/macOS端：`openssl rand -base64 64` 或 `head -c 64 /dev/urandom | base64`
  - 注意：请妥善保管JWT_SECRET，不要泄露给他人；定期更换JWT_SECRET可以防止JWT被破解，更换后，所有已经登录用户的token将全部失效，需要重新登录（未做JWT_SECRET版本管理）

`SALT_ROUNDS`：可选，密码加密盐的迭代次数/字符串秘钥，数字/秘钥字符串，默认为10
