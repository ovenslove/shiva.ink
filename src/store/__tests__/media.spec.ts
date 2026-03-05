import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useMediaStore } from '../index'

describe('useMediaStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should have 50 mock albums with full fields', () => {
    const store = useMediaStore()
    expect(store.albums.length).toBe(50)
    
    const firstAlbum = store.albums[0]
    expect(firstAlbum).toHaveProperty('id')
    expect(firstAlbum).toHaveProperty('title')
    expect(firstAlbum).toHaveProperty('cover')
    expect(firstAlbum).toHaveProperty('photoCount')
    expect(firstAlbum).toHaveProperty('createdAt')
    expect(firstAlbum).toHaveProperty('updatedAt')
    expect(typeof firstAlbum.photoCount).toBe('number')
    expect(new Date(firstAlbum.createdAt).getTime()).not.toBeNaN()
  })

  it('should support pagination for albums', async () => {
    const store = useMediaStore()
    
    // 测试第一页
    const result1 = await store.getAlbumsByPage(1, 10)
    expect(result1.list.length).toBe(10)
    expect(result1.total).toBe(50)
    expect(result1.page).toBe(1)
    expect(result1.list[0].id).toBe(1)
    
    // 测试第二页
    const result2 = await store.getAlbumsByPage(2, 10)
    expect(result2.list.length).toBe(10)
    expect(result2.page).toBe(2)
    expect(result2.list[0].id).toBe(11)
    
    // 测试最后一页
    const result5 = await store.getAlbumsByPage(5, 10)
    expect(result5.list.length).toBe(10)
    expect(result5.list[9].id).toBe(50)
    
    // 测试超出范围
    const result6 = await store.getAlbumsByPage(6, 10)
    expect(result6.list.length).toBe(0)
  })

  it('should respond to pagination within 200ms', async () => {
    const store = useMediaStore()
    const start = performance.now()
    await store.getAlbumsByPage(1, 10)
    const end = performance.now()
    expect(end - start).toBeLessThan(200)
  })
})
