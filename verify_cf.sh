#!/bin/bash

# Cloudflare 性能与配置验证脚本
# 用途：检查 shiva.ink 的 Cloudflare 代理、缓存和压缩状态

DOMAIN="shiva.ink"
URL="https://${DOMAIN}/"

echo "========================================"
echo "正在验证 ${DOMAIN} 的 Cloudflare 配置..."
echo "========================================"

# 1. 检查 DNS 是否通过 Cloudflare 代理
echo -e "\n[1/4] 正在检查 DNS 代理状态..."
NS_RESULT=$(nslookup ${DOMAIN} | grep -v "#")
if echo "$NS_RESULT" | grep -q "cloudflare"; then
    echo "✅ DNS 已成功代理 (Cloudflare IPs detected)"
else
    echo "⚠️  DNS 可能未代理或使用的是非 Cloudflare 解析"
fi

# 2. 检查 SSL/TLS 和 HTTP 版本
echo -e "\n[2/4] 正在检查 SSL/TLS 和 HTTP/3 协议..."
CURL_INFO=$(curl -I -s ${URL})
if echo "$CURL_INFO" | grep -q "HTTP/3"; then
    echo "✅ 已启用 HTTP/3 (QUIC)"
elif echo "$CURL_INFO" | grep -q "HTTP/2"; then
    echo "✅ 已启用 HTTP/2"
else
    echo "⚠️  未检测到 HTTP/2/3，请检查 Cloudflare 协议设置"
fi

# 3. 检查缓存命中状态 (CF-Cache-Status)
echo -e "\n[3/4] 正在检查缓存命中状态 (多次请求)..."
for i in {1..3}
do
    CACHE_STATUS=$(curl -I -s ${URL} | grep "cf-cache-status")
    echo "请求 $i: $CACHE_STATUS"
done
if echo "$CACHE_STATUS" | grep -q "HIT"; then
    echo "✅ 缓存已命中 (HIT)"
else
    echo "ℹ️  当前为 MISS/DYNAMIC，若是新配置请稍后重试"
fi

# 4. 检查压缩 (Brotli / Gzip)
echo -e "\n[4/4] 正在检查内容压缩..."
BROTLI_CHECK=$(curl -I -s -H "Accept-Encoding: br" ${URL} | grep "content-encoding")
if [ -z "$BROTLI_CHECK" ]; then
    GZIP_CHECK=$(curl -I -s -H "Accept-Encoding: gzip" ${URL} | grep "content-encoding")
    echo "ℹ️  压缩状态: $GZIP_CHECK (建议开启 Brotli)"
else
    echo "✅ 已开启 Brotli 压缩: $BROTLI_CHECK"
fi

echo -e "\n========================================"
echo "验证完成！详细配置请参考 CLOUDFLARE_OPTIMIZATION.md"
echo "========================================"
