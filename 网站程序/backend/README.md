# V5 后端说明

## 本地启动

```bash
cd backend
npm install
npm start
```

然后访问：

```text
http://localhost:8787
```

不要直接双击 `frontend/index.html`，否则 `/api/leads` 接口不会运行。

## 主要接口

### 提交线索

```http
POST /api/leads
Content-Type: application/json
```

### 读取线索

```http
GET /api/leads
X-Admin-Token: 你的 ADMIN_TOKEN
```

### 下载 CSV

```http
GET /api/leads.csv?token=你的 ADMIN_TOKEN
```

## 配置

复制 `.env.example` 为 `.env`：

```bash
cp .env.example .env
```

配置项：

```env
PORT=8787
ADMIN_TOKEN=change-this-admin-token
WEBHOOK_URL=
WEBHOOK_TYPE=generic
```

`WEBHOOK_TYPE` 可选：

- `generic`
- `feishu`
- `wecom`

## 数据保存

后端会保存两份数据：

- `backend/data/leads.json`
- `backend/data/leads.csv`

## 正式上线提醒

正式上线时建议：

1. 设置强 `ADMIN_TOKEN`
2. 使用 HTTPS
3. 服务器定期备份 `backend/data`
4. 配置 Webhook 推送到飞书或企业微信
5. 不要把客户详细资料公开展示


## Windows 新手提醒

根目录的 `start-windows.bat` 已经修复为 Windows 兼容写法：

```bat
cd /d "%~dp0backend"
call npm install
call npm start
```

PowerShell 当前目录不重要，双击根目录的 `start-windows.bat` 即可启动。
