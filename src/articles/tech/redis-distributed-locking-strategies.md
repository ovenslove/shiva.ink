---
title: "Redis 分布式锁：Redlock 算法与高可用实战"
date: "2025-03-06T08:00:00Z"
author: "Shiva"
categories: ["tech", "database"]
tags: ["Redis", "Distributed Systems", "Locking", "Backend", "Performance"]
summary: "深入剖析 Redis 分布式锁的实现原理，对比 SETNX 与 Redlock 算法，探讨在高并发场景下如何确保锁的安全性与一致性。"
cover: "https://picsum.photos/id/6/800/600"
---

## 1. 为什么需要分布式锁？

在分布式架构下，传统的本地锁（如 Java 的 `synchronized` 或 Go 的 `Mutex`）无法跨进程工作。当多个微服务实例同时尝试修改同一个全局资源（如库存扣减、优惠券领取）时，必须引入分布式锁。

## 2. 基础方案：SETNX + EXPIRE

最简单的 Redis 分布式锁实现：
```bash
SET lock_key unique_value NX EX 10
```
- **NX**: 只有 Key 不存在时才设置成功（保证互斥性）。
- **EX**: 设置过期时间（防止死锁）。

### 2.1 潜在风险：锁提前过期

如果业务逻辑执行时间超过了锁的过期时间，锁会自动释放，导致第二个线程进入临界区。
**解决方案**：使用 Redisson（Java）或类似库提供的“看门狗”机制，在业务执行期间定期延长锁的 TTL。

## 3. 高阶方案：Redlock 算法

在 Redis 集群环境下，单节点锁存在单点故障风险。Antirez 提出了 Redlock 算法：
1. 获取当前系统时间。
2. 依次尝试在 5 个独立的 Redis 实例上获取锁。
3. 如果在多数（3个以上）实例上获取成功，且总耗时小于锁的过期时间，则认为获取锁成功。
4. 释放锁时，向所有实例发送删除指令。

## 4. 总结

分布式锁没有完美的方案，只有最适合的方案。对于一致性要求极高的金融场景，应优先考虑 Zookeeper 或 Etcd。而对于追求极致性能且能容忍极低概率失效的互联网场景，Redis 依然是首选。
