<!--
 * @Author: ovenslove 1905997838@qq.com
 * @Date: 2026-03-03 15:44:37
 * @LastEditors: ovenslove 1905997838@qq.com
 * @LastEditTime: 2026-03-03 15:44:39
 * @FilePath: /shiva.ink/.trae/rules/project_rules.md
 * @Description: 
 * 
 * Copyright (c) 2026 by Yatsen, All Rights Reserved. 
-->
项目规则指南（Shiva.ink）

1) 技术栈与版本锁定
- 语言：TypeScript 5.4.x；框架：Vue 3.4.27；构建：Vite 4.5.x
- 路由：vue-router 4.3.2；状态：Pinia 2.1.7；UI：Element Plus 2.7.3
- 测试：Vitest 0.34.6、@vue/test-utils 2.4.6
- 版本锁定：禁用^/~，统一 exact；用 npm ci 保持 lockfile 一致

2) 测试规范
- 框架：Vitest；执行：npx vitest run 与 npm run build 必须通过
- 覆盖率最低：lines/functions/branches ≥ 80%
- 命名：单元/集成测试均使用 *.spec.ts
- 集成测试：需 mock 路由/Pinia/第三方库；报告：lcov+html

3) API 黑名单与替代
- 禁止 v-html 渲染不可信内容（先消毒）；替代：受控渲染
- 禁止未清理的 window 事件/定时器；替代：onMounted/onUnmounted 管理
- 禁止 deep:true 的全量 watch；替代：精确依赖 + computed
- 禁止 eval/new Function 与直接 DOM 操作；替代：组合式逻辑/指令/组件封装

4) 代码风格与提交
- 缩进 2 空格，单引号，推荐无分号
- 命名：PascalCase.vue、kebab-case.ts/scss
- 提交：<type>(<scope>): <subject>（types 见 .versionrc.json）

5) 性能质量指标
- 首屏加载 ≤ 3s（移动端 4G）；初始 JS(gzip) ≤ 250KB
- 路由组件按需加载；图片默认懒加载；单页面新增依赖 ≤ 1

6) 维护与验证
- 规则按季度更新；每次 PR 必附验证与回滚方案
