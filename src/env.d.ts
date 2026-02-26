/*
 * @Author: ovenslove 1905997838@qq.com
 * @Date: 2026-02-26 16:33:02
 * @LastEditors: ovenslove 1905997838@qq.com
 * @LastEditTime: 2026-02-26 16:33:04
 * @FilePath: /shiva.ink/src/env.d.ts
 * @Description: 
 * 
 * Copyright (c) 2026 by Yatsen, All Rights Reserved. 
 */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
