# Trae 团队开发规范（Shiva.ink）

> 目标：在不牺牲交付效率的前提下，让代码质量、性能与可维护性具备“可执行、可量化、可复盘”的统一标准。

## 0. 适用范围与原则

- **适用范围**：本仓库前端（Vue 3 + TypeScript + Vite）代码、测试、文档、CI 配置与发布流程。
- **默认原则**：先一致、再优化；先可测、再重构；先有指标、再谈体验。
- **质量门禁**：合并到主分支（或发布分支）的变更必须满足“第 9 章：质量门禁”。

## 1. 项目技术栈基线（以当前仓库为准）

- **框架**：Vue 3（组合式 API）
- **语言**：TypeScript（strict 开启）
- **构建**：Vite
- **路由**：vue-router 4
- **状态管理**：Pinia 2
- **组件库**：Element Plus
- **测试**：Vitest + @vue/test-utils + @pinia/testing（当前仓库已存在示例测试）
- **版本与变更日志**：standard-version + .versionrc.json（遵循 Conventional Commits）
- **部署**：GitHub Actions + GitHub Pages（仓库已有 workflow）

## 2. 目录结构与命名规范

### 2.1 目录职责

- `src/views/`：页面级组件（与路由一一对应，允许聚合多个业务组件）
- `src/components/`：可复用组件（跨页面复用，尽量无业务耦合）
- `src/store/`：Pinia stores、mock 数据（如保留 mock，需标注用途与边界）
- `src/router/`：路由定义与导航守卫
- `src/styles/`：全局样式、变量、主题
- `public/`：纯静态资源与版本信息（如 `version.json`）

### 2.2 命名规则（可执行）

- **Vue SFC 文件**：`PascalCase.vue`（与当前仓库一致，如 `ArticleDetail.vue`）
- **组件目录**：与组件同名（如需要），`components/PhotoGallery.vue`
- **测试文件**：`*.spec.ts`，与被测文件同层或放在 `__tests__/`
- **路由 name**：`PascalCase`，与页面组件一致
- **CSS/SCSS 变量**：`kebab-case`；JS/TS 变量：`camelCase`；类型/接口：`PascalCase`

## 3. 代码规范（TypeScript + Vue 3）

### 3.1 TypeScript 规则（必须）

- **strict 必须保持开启**（当前已开启）。
- 禁止以 `any` 作为默认逃生门；仅在边界层（第三方库类型缺失）使用，并要求：
  - 在同一 PR 内补齐最小可用类型，或
  - 明确限定 `unknown` + 类型收窄。
- 不允许提交未使用的局部变量/参数（当前 tsconfig 已启用 `noUnusedLocals/noUnusedParameters`）。
- 不允许引入有副作用但无使用的依赖（当前已启用 `noUncheckedSideEffectImports`）。

### 3.2 Vue 组件规范（必须）

- 统一采用 **组合式 API**；建议优先 `setup` 写法（在本仓库保持风格一致即可）。
- **Props 设计**：
  - Props 必须类型明确，避免“一把梭对象”；
  - 可选值必须有明确默认值（或在使用处做兜底）；
  - Props 变化应可预测，避免在子组件内部“偷偷改 Props 派生对象”。
- **Emits 设计**：
  - 事件名统一 `kebab-case`；
  - 事件 payload 类型必须明确（TS 约束）。
- **副作用**：
  - 只在 `onMounted/onUnmounted` 管理 DOM 事件、定时器、第三方实例；
  - 所有副作用必须能被释放（Unmount 时清理）。
- **模板复杂度**：
  - 单个组件模板超过 200 行或出现 3 层以上条件嵌套，应拆分为子组件或抽出 render 数据。

### 3.3 依赖引入与模块边界（必须）

- 页面组件可以依赖业务组件与 store；业务组件不应反向依赖页面组件。
- 避免在组件中直接访问全局对象（`window/document`）而无守卫；需要在生命周期内使用并保证销毁。
- 第三方库初始化要集中管理（避免同一页面重复创建实例导致内存泄漏）。

### 3.4 样式规范（必须）

- 优先使用 `src/styles/` 中的变量与公共样式（如 `variables.scss`）。
- 动画优先 `transform/opacity`，避免频繁触发布局的属性（`top/left/width/height`）。
- 禁止在业务代码中滥用 `!important`；允许用于修复第三方样式冲突，但需在同一 PR 给出原因与替代方案。

## 4. 组件设计原则（可量化检查）

### 4.1 组件分层

- **页面组件（Page）**：负责路由参数、数据聚合、页面布局。
- **业务组件（Feature）**：承载业务交互（相册、文章详情等），可依赖 Pinia。
- **基础组件（UI）**：无业务语义，输入输出明确（Props/slots/emits），可沉淀到 `src/components/`。

### 4.2 API 设计准则（检查清单）

- Props/slots/emits 必须写清楚“输入、输出、边界条件”。
- 默认态/空态/错误态必须可被渲染（Element Plus 的 `Empty`/`Skeleton` 等组件可复用）。
- 组件必须具备可测性：关键分支能通过测试触达（见第 6 章）。

## 5. 性能优化标准（指标 + 动作）

### 5.1 指标（可量化）

- **Lighthouse（移动端）**：Performance ≥ 85、Accessibility ≥ 90、Best Practices ≥ 90、SEO ≥ 90（以线上同一页面多次取中位数）。
- **构建产物预算（建议）**：
  - 初始 JS（gzip）≤ 250KB（如超出，需要拆包与懒加载方案）
  - 单页面新增依赖 ≤ 1 个（如超出，需要说明收益与替代方案）
- **交互指标（建议）**：
  - 首次可交互时间（TTI）不高于上一版本的 110%
  - 长列表/相册滚动不出现明显掉帧（以 DevTools Performance/帧率采样为准）

### 5.2 标准动作（必须遵守）

- 路由组件必须采用动态导入（当前路由已使用 `() => import()`）。
- 图片资源默认懒加载（当前仓库已使用 `vue-lazyload` 相关依赖，新增图片展示需沿用或对齐）。
- 对 PhotoSwipe、viewer 等重库：只在需要页面/组件中按需初始化，并在卸载时 `destroy`。
- 避免不必要的响应式：
  - 大数组/大对象优先 `shallowRef`/非响应式缓存（视场景选用）
  - 禁止无条件 `deep: true` watch；必须说明必要性并限定触发范围

## 6. 测试规范与覆盖率要求（可执行 + 可度量）

### 6.1 基线要求（当前仓库即可执行）

- PR 合并前必须通过：
  - `npm run build`（包含 `vue-tsc` 类型检查）
  - `npx vitest run`（或在未来补齐 `npm run test` 后以脚本为准）
- 新增/修改的逻辑必须提供对应测试，至少覆盖：
  - 关键渲染分支（空态/有数据/错误态其一）
  - 关键交互（点击、路由跳转、store action）

### 6.2 覆盖率门槛（建议落地为脚本门禁）

> 当前仓库尚未内置 coverage 插件与阈值门禁；本章定义“应达到的量化标准”和“落地方式”。

- **全局覆盖率（建议）**：lines ≥ 60%、functions ≥ 60%、branches ≥ 50%
- **核心模块覆盖率（必须）**（与业务强相关的 store、路由守卫、关键组件）：lines ≥ 80%、branches ≥ 70%
- **回归要求（必须）**：修复 bug 的 PR 必须补齐能复现 bug 的测试用例。

### 6.3 测试用例规范（必须）

- 用例结构：Arrange / Act / Assert 三段式；一个用例只验证一个行为。
- 依赖隔离：对第三方库用 mock；对 Pinia 用 `@pinia/testing` 的 `createTestingPinia`。
- 允许使用 `stubs` 替代 Element Plus 重组件，但关键交互组件需至少 1 个端到端级（或集成级）用例覆盖。

## 7. Git 分支与提交规范（Conventional Commits）

### 7.1 分支命名（必须）

- `feat/<scope>-<short-desc>`
- `fix/<scope>-<short-desc>`
- `perf/<scope>-<short-desc>`
- `refactor/<scope>-<short-desc>`
- `docs/<scope>-<short-desc>`
- `chore/<scope>-<short-desc>`

### 7.2 Commit Message（必须）

格式：`<type>(<scope>): <subject>`

- **type** 取值与 changelog 对齐（见仓库 `.versionrc.json`）：`feat|fix|perf|revert|docs|style|chore|refactor|test|build|ci`
- **scope**：模块或页面（如 `gallery`、`article-detail`、`router`、`store`、`build`）
- **subject**：中文或英文均可，但需可读、可复现，不写“update”“fix bug”这类无信息内容

示例：

- `feat(gallery): add PhotoSwipe preview for images`
- `fix(router): correct meta title for archive route`
- `perf(build): optimize chunk split strategy`

### 7.3 PR 规范（必须）

- PR 描述必须包含：
  - 变更目标（What/Why）
  - 风险点与回滚方式
  - 验证方式（构建/测试/页面自测清单）
- PR 必须至少 1 人 Review；涉及架构/依赖升级至少 2 人 Review。

## 8. 文档编写规范（可复用、可维护）

- 面向“未来第一次接手的人”写文档：先给结论，再给操作步骤，再给原理与参考。
- 文档必须可执行：
  - 命令可直接复制执行（注明运行目录与前置条件）
  - 配置项给出“推荐值 + 为什么”
- 变更类文档与代码同 PR：功能引入/行为变化必须同时更新 README 或对应专题文档。

## 9. 质量门禁（合并阻断规则）

以下任一条件不满足，不允许合并：

- `npm run build` 失败（含 `vue-tsc` 失败）
- `npx vitest run` 失败
- 引入新依赖但未说明收益、体积影响与替代方案
- 存在明显的性能退化（Lighthouse/包体积/交互指标恶化且无解释）
- Review 未通过或未处理必改项

## 10. 持续改进机制（PDCA）

- **每周**：统计“缺陷类型”与“回滚次数”，输出 Top 3 改进项（Owner + Deadline）。
- **每月**：做一次性能与依赖健康检查：
  - Lighthouse 抽样（首页/相册/文章详情）
  - 依赖升级评估（安全修复优先）
- **每季度**：更新本规范：
  - 删除不再适用条款
  - 将“建议项”中已落地的内容升级为“必须项”

## 11. Trae 使用规则（对仓库协作与自动化助手生效）

- 任何变更优先保持与当前仓库风格一致（Vue 3 + TS + Vite + Pinia + Element Plus）。
- 在引入工具（如 ESLint/Prettier/coverage）前必须评估：收益、维护成本、对 CI 的影响、迁移路径。
- 对外链资源（图片/视频/CDN）变更必须考虑缓存策略与降级方案。

