# 麻辣烫收银系统 - 开发经验

## 重要教训

### 2026-02-28
**问题：** 修改前端代码后，浏览器刷新没有变化

**原因：** Docker 容器内的代码是 build 时的快照，修改本地文件不会自动同步

**解决方案：**
1. 修改代码后需要重新 build：`docker compose build frontend`
2. 然后重启容器：`docker compose up -d frontend`

**教训：** 以后每次代码改动后，都要自动执行 build + 重启，用户只需要浏览器测试
