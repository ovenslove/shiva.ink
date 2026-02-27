<!--
 * @Author: ovenslove 1905997838@qq.com
 * @Date: 2026-02-27 17:35:01
 * @LastEditors: ovenslove 1905997838@qq.com
 * @LastEditTime: 2026-02-27 17:35:02
 * @FilePath: /shiva.ink/CLOUDFLARE_OPTIMIZATION.md
 * @Description: 
 * 
 * Copyright (c) 2026 by Yatsen, All Rights Reserved. 
-->
# Cloudflare 性能优化与应急响应预案

本文档基于 `shiva.ink` 部署在 GitHub Pages 的现状，提供了 Cloudflare 的全方位优化配置指南及应急预案。

## 1. DNS 与 SSL/TLS 配置验证
*   **DNS 解析**：
    *   确保所有 `A` 记录、`AAAA` 记录或 `CNAME` 记录的“代理状态”为 **已代理 (Proxied - 橙色云朵)**。
    *   验证命令：`dig shiva.ink` 或 `nslookup shiva.ink`，应返回 Cloudflare 的 IP 地址。
*   **SSL/TLS 加密模式**：
    *   **建议设置**：`Full (Strict)` (完全/严格)。
    *   **原因**：GitHub Pages 提供有效的 SSL 证书，开启严格模式可确保端到端的全链路加密。
    *   **附加项**：开启 `Always Use HTTPS` 和 `Minimum TLS Version: 1.2`。

## 2. 缓存规则配置 (Caching Strategy)
*   **缓存级别**：`Standard`。
*   **浏览器缓存 TTL**：`1 Month` (因为 Vite 构建资源带有 hash)。
*   **边缘缓存 TTL**：`7 Days`。
*   **页面规则 (Page Rules)**：
    1.  `shiva.ink/assets/*` -> `Cache Level: Cache Everything`, `Edge Cache TTL: 1 Month` (静态资源长期缓存)。
    2.  `shiva.ink/index.html` -> `Cache Level: Cache Everything`, `Edge Cache TTL: 2 Hours` (主入口缓存短一些，方便更新)。

## 3. 性能加速功能 (Performance Optimization)
*   **Auto Minify**：在 Cloudflare 中勾选 `JavaScript`, `CSS`, `HTML` (尽管 Vite 已压缩，Cloudflare 可进行二次优化)。
*   **Brotli**：开启。提供比 Gzip 更高的压缩比。
*   **Rocket Loader**：开启。异步加载 JS 资源，提升首次内容渲染 (FCP) 速度。
*   **Early Hints**：开启。允许浏览器在服务器处理请求时提前加载资源。

## 4. 安全防护 (Security & WAF)
*   **DDoS 防护**：Cloudflare 默认开启，保持默认配置即可。
*   **WAF 防火墙规则**：
    *   拦截恶意爬虫：启用 `Cloudflare Managed Ruleset`。
    *   国家代码过滤：如果仅针对特定区域（如中国），可配置防火墙规则，对异常访问源进行验证。
*   **Bot Fight Mode**：开启。拦截已知的恶意自动化程序。

## 5. 源站响应头优化
由于源站为 GitHub Pages，无法直接修改 Nginx 配置，但可以通过 Cloudflare 的 **Transform Rules** 修改响应头：
*   **增加**：`Cache-Control: public, max-age=31536000, immutable` (针对 `/assets/` 路径)。
*   **增加**：`X-Content-Type-Options: nosniff` (安全增强)。

## 6. 监控与告警机制
*   **Health Checks**：在 Cloudflare Dashboard 开启健康检查，监控 `https://shiva.ink/`。
*   **告警设置**：
    *   配置邮件/Webhook 告警，当错误率 (5xx 响应) 超过 5% 时自动触发通知。
    *   监控响应时间 (Latency) 波动。

## 7. 性能验证与压力测试
*   **工具推荐**：
    *   [Lighthouse](https://web.dev/measure/)：验证 Core Web Vitals (LCP, FID, CLS)。
    *   [WebPageTest](https://www.webpagetest.org/)：测试全球不同地区的访问速度。
    *   `ab` (Apache Benchmark)：`ab -n 1000 -c 10 https://shiva.ink/` 进行基础并发压力测试。

## 8. 应急响应预案 (DR Plan)
*   **故障 1：CDN 节点异常或被墙**
    *   **响应**：将 Cloudflare DNS 记录切换为“仅限 DNS (DNS Only)”，直接指向 GitHub Pages 源站 IP。
*   **故障 2：部署更新后页面错乱 (缓存未刷新)**
    *   **响应**：在 Cloudflare Dashboard 执行 `Purge Everything` 或 `Purge by URL`。
*   **故障 3：恶意流量攻击**
    *   **响应**：开启 `Under Attack Mode`，提升安全验证级别。
*   **回滚流程**：
    1.  确认故障类型。
    2.  如需回滚代码，执行 GitHub Action 回滚到上一版本。
    3.  立即清除 Cloudflare 缓存。
