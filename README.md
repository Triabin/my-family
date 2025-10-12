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
├── core    // 公共代码
├── server  // 后端代码
└── front   // 前端代码
```

## 环境变量

`PORT`：可选，服务端口，默认3000

`FAMILY_NAME`：必填，家族姓氏

`DB_FILE`: 可选，sqlite数据库文件路径，默认`./data/family.db`

`DB_PASSWORD`：可选，sqlite数据库密码，默认空
