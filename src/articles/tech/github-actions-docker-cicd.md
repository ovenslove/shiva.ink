---
title: "GitHub Actions 与 Docker：构建全自动 CI/CD 流水线"
date: "2025-03-04T11:00:00Z"
author: "Shiva"
categories: ["tech", "devops"]
tags: ["GitHub Actions", "Docker", "CI/CD", "Automation", "DevOps"]
summary: "手把手教你如何利用 GitHub Actions 自动化构建 Docker 镜像，并将其一键部署到云端，实现现代化的持续集成与持续交付。"
cover: "https://picsum.photos/id/4/800/600"
---

## 1. 为什么 DevOps 是现代开发的灵魂？

在敏捷开发时代，传统的“手动部署”已经成为交付速度的瓶颈。DevOps 提倡通过工具链实现自动化的构建、测试和部署，从而：
- **减少人为失误**：流水线代替手动操作。
- **快速反馈循环**：代码提交即触发测试。
- **一致性部署**：Docker 确保了本地环境与生产环境的完全一致。

## 2. GitHub Actions 核心组件

GitHub Actions 是一种基于 YAML 配置的自动化工作流引擎。其核心概念包括：
- **Workflow**: 整个自动化流程。
- **Job**: 流程中的一个独立阶段。
- **Step**: Job 中的一个具体操作（如运行命令或调用 Action）。
- **Runner**: 执行工作流的服务器。

## 3. 实战：构建并推送 Docker 镜像

以下是一个典型的 `main.yml` 工作流配置：

```yaml
name: Build and Deploy

on:
  push:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Login to DockerHub
        uses: docker/login-action@v2
        with:
          username: ${{ secrets.DOCKERHUB_USERNAME }}
          password: ${{ secrets.DOCKERHUB_TOKEN }}

      - name: Build and push image
        uses: docker/build-push-action@v4
        with:
          context: .
          push: true
          tags: shiva/shiva-ink:latest
```

## 4. 自动化测试与质量门禁

在推送镜像之前，必须通过单元测试和 Lint 检查：

```yaml
      - name: Install dependencies
        run: npm install

      - name: Run unit tests
        run: npm test

      - name: Run Lint check
        run: npm run lint
```

## 5. 持续交付：一键部署到云服务器

镜像推送到仓库后，可以通过 SSH 远程命令更新服务器上的容器：

```yaml
      - name: Deploy to Server via SSH
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SERVER_SSH_KEY }}
          script: |
            docker pull shiva/shiva-ink:latest
            docker stop shiva-app || true
            docker rm shiva-app || true
            docker run -d --name shiva-app -p 80:3000 shiva/shiva-ink:latest
```

## 6. 安全性：Secret 管理

切记：**永远不要将 API Key、密码或 SSH 私钥硬编码在 YAML 文件中。**
使用 GitHub 仓库的 `Settings > Secrets and variables > Actions` 功能进行加密存储。

## 7. 总结

GitHub Actions + Docker 的组合为开发者提供了一套低门槛且极其强大的 CI/CD 解决方案。通过编写简单的配置文件，你可以让代码从提交到上线实现秒级响应。

---
*注：本文为 DevOps 自动化专题。下一期我们将探讨 Kubernetes 在大规模集群管理中的核心原理。*
