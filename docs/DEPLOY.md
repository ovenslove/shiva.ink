# Shiva.ink Docker 部署指南

本文档详细介绍了如何使用 Docker 和 Docker Compose 快速部署 Shiva.ink 应用。

## 📋 前置要求

- **Docker**: v20.10+
- **Docker Compose**: v1.29+
- **Git**

## 🚀 快速开始

### 1. 克隆代码库

```bash
git clone https://github.com/ovenslove/shiva.ink.git
cd shiva.ink
```

### 2. 配置环境变量

复制示例配置文件并进行修改：

```bash
cp .env.example .env
```

编辑 `.env` 文件，根据实际情况修改端口号和其他配置：

```env
APP_PORT=8080      # 宿主机访问端口
NODE_ENV=production
```

### 3. 一键部署

执行部署脚本：

```bash
./deploy.sh
```

该脚本将自动执行以下操作：
1. 备份当前的 `dist` 目录（如果存在）。
2. 构建 Docker 镜像（包含 Node.js 构建阶段和 Nginx 生产阶段）。
3. 停止旧容器并启动新容器。
4. 执行健康检查，确保服务启动成功。

访问 `http://localhost:8080` (或你配置的端口) 查看应用。

## 🛠️ 手动部署流程

如果你不想使用脚本，可以手动执行以下命令：

**构建镜像**
```bash
docker build -t shiva-ink:latest .
```

**启动服务**
```bash
docker-compose up -d
```

**停止服务**
```bash
docker-compose down
```

## 🔄 零停机更新与回滚

### 更新部署
由于使用了 Nginx 作为静态资源服务器，且 Docker Compose 在重新创建容器时通常只有毫秒级的切换停机时间，对于静态站点来说基本可以视为无感更新。

如果需要更严格的零停机，建议在前端配合负载均衡器（如 Traefik 或外部 Nginx）使用蓝绿部署策略。本方案提供的 `deploy.sh` 适用于单机快速部署。

### 回滚方案
如果新版本部署失败，脚本会提示错误。你可以手动回滚到上一个稳定镜像（假设你推送了 tag）：

```bash
# 假设上一个版本是 v1.0.18
docker tag shiva-ink:v1.0.18 shiva-ink:latest
docker-compose up -d
```

或者从本地备份中恢复 `dist` 目录：
```bash
tar -xzf backups/backup_YYYYMMDD_HHMMSS.tar.gz
# 然后重新构建镜像
docker build -t shiva-ink:latest .
docker-compose up -d
```

## 🔍 故障排查

**1. 容器无法启动**
查看容器日志：
```bash
docker logs shiva-ink-app
```

**2. 端口冲突**
如果 `8080` 端口被占用，请修改 `.env` 文件中的 `APP_PORT`。

**3. 构建失败**
如果是 Node.js 构建阶段失败，尝试在本地运行 `npm run build` 查看详细错误日志。注意本项目依赖 Node.js v16 环境。

## 📁 目录结构说明

- `Dockerfile`: 定义了多阶段构建流程（Node 16 构建 -> Nginx 托管）。
- `nginx.conf`: Nginx 配置文件，包含 SPA 路由重定向、Gzip 压缩和安全头设置。
- `docker-compose.yml`: 定义服务编排，映射端口和卷。
- `deploy.sh`: 自动化部署脚本。
- `.env`: 环境变量配置文件。
