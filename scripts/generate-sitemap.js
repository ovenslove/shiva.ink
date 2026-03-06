import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// 模拟 __dirname
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const BASE_URL = 'https://shiva.ink'
const ROUTES = [
  '/',
  '/gallery',
  '/video',
  '/article',
  '/archive'
]

function generateSitemap() {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${ROUTES.map(route => `
  <url>
    <loc>${BASE_URL}/#${route}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${route === '/' ? '1.0' : '0.8'}</priority>
  </url>
  `).join('')}
</urlset>`

  const publicDir = path.resolve(__dirname, '../public')
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir)
  }
  
  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap)
  console.log('✅ Sitemap generated successfully!')
}

generateSitemap()
