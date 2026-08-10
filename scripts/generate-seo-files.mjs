import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const SITE_URL = 'https://yogeshtandan.in';
const cwd = process.cwd();
const contentDir = path.join(cwd, 'content');
const publicDir = path.join(cwd, 'public');
const outDir = path.join(cwd, 'out');

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-');
}

// 1. Get Blog Posts
function getBlogPosts() {
  const blogDir = path.join(contentDir, 'blog');
  if (!fs.existsSync(blogDir)) return [];
  const files = fs.readdirSync(blogDir).filter((f) => f.endsWith('.md'));
  
  return files.map((filename) => {
    const slug = filename.replace(/\.md$/, '');
    const content = fs.readFileSync(path.join(blogDir, filename), 'utf8');
    const { data } = matter(content);
    return {
      slug,
      title: data.title || slug,
      description: data.description || '',
      date: data.date ? new Date(data.date).toUTCString() : new Date().toUTCString(),
      rawDate: data.date || '',
      category: data.category || 'General',
      coverImage: data.coverImage || '',
    };
  }).sort((a, b) => new Date(b.rawDate).getTime() - new Date(a.rawDate).getTime());
}

// 2. Get Projects
function getProjects() {
  const projectsDir = path.join(contentDir, 'projects');
  if (!fs.existsSync(projectsDir)) return [];
  const files = fs.readdirSync(projectsDir).filter((f) => f.endsWith('.md'));
  
  return files.map((filename) => {
    const slug = filename.replace(/\.md$/, '');
    const content = fs.readFileSync(path.join(projectsDir, filename), 'utf8');
    const { data } = matter(content);
    return {
      slug,
      title: data.title || slug,
      date: data.date || '',
    };
  });
}

// Generate sitemap.xml
function generateSitemap(blogPosts, projects, categories) {
  const staticPages = ['', '/about', '/projects', '/blog'];

  const urls = [
    ...staticPages.map((p) => ({ url: `${SITE_URL}${p}`, changefreq: 'weekly', priority: '1.0' })),
    ...categories.map((c) => ({ url: `${SITE_URL}/blog/category/${c}`, changefreq: 'weekly', priority: '0.8' })),
    ...blogPosts.map((b) => ({ url: `${SITE_URL}/blog/${b.slug}`, changefreq: 'monthly', priority: '0.9' })),
    ...projects.map((pr) => ({ url: `${SITE_URL}/projects/${pr.slug}`, changefreq: 'monthly', priority: '0.8' })),
  ];

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (item) => `  <url>
    <loc>${item.url}</loc>
    <changefreq>${item.changefreq}</changefreq>
    <priority>${item.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;
}

// Generate robots.txt
function generateRobots() {
  return `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`;
}

// Generate rss.xml
function generateRss(blogPosts) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Yogesh Tandan Chronicles &amp; Daily Planet Newsroom</title>
    <link>${SITE_URL}</link>
    <description>Technical articles on System Design, Automation, WebGL 3D Physics, Next.js, and AWS DevOps by Yogesh Tandan.</description>
    <language>en-us</language>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
    ${blogPosts
      .map(
        (post) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${SITE_URL}/blog/${post.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/blog/${post.slug}</guid>
      <pubDate>${post.date}</pubDate>
      <description><![CDATA[${post.description}]]></description>
      <category>${post.category}</category>
    </item>`
      )
      .join('')}
  </channel>
</rss>`;
}

function run() {
  const blogPosts = getBlogPosts();
  const projects = getProjects();
  const categories = Array.from(
    new Set(blogPosts.map((b) => slugify(b.category)))
  );

  const sitemapContent = generateSitemap(blogPosts, projects, categories);
  const robotsContent = generateRobots();
  const rssContent = generateRss(blogPosts);

  const targets = [publicDir, outDir];

  targets.forEach((targetDir) => {
    if (fs.existsSync(targetDir)) {
      fs.writeFileSync(path.join(targetDir, 'sitemap.xml'), sitemapContent);
      fs.writeFileSync(path.join(targetDir, 'robots.txt'), robotsContent);
      fs.writeFileSync(path.join(targetDir, 'rss.xml'), rssContent);
      console.log(`[SEO Script] Wrote sitemap.xml, robots.txt, and rss.xml to ${targetDir}`);
    }
  });
}

run();
