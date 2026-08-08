import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { Marked } from "marked";

const contentDirectory = path.join(process.cwd(), "content");

export interface HeadingItem {
  id: string;
  text: string;
  level: number;
}

export interface ProjectData {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  coverImage: string;
  featured: boolean;
  githubUrl?: string;
  liveUrl?: string;
  contentHtml: string;
  headings: HeadingItem[];
}

export interface BlogPostData {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  coverImage: string;
  featured: boolean;
  readTime: string;
  category: string;
  contentHtml: string;
  headings: HeadingItem[];
}

// Helper function to parse markdown into HTML and extract heading structure with unique IDs
export function parseMarkdownContent(rawMarkdown: string): { contentHtml: string; headings: HeadingItem[] } {
  const markedLexer = new Marked();
  const seenHeadings = new Map<string, number>();

  const slugify = (text: string) => {
    let slug = text
      .toLowerCase()
      .replace(/<[^>]+>/g, "")
      .replace(/[^\w\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");
    if (!slug) slug = "section";
    const count = seenHeadings.get(slug) || 0;
    seenHeadings.set(slug, count + 1);
    return count > 0 ? `${slug}-${count}` : slug;
  };

  const headings: HeadingItem[] = [];
  const tokens = markedLexer.lexer(rawMarkdown);

  tokens.forEach((token) => {
    if (token.type === "heading" && token.depth <= 3) {
      const text = token.text.trim();
      const id = slugify(text);
      headings.push({
        id,
        text,
        level: token.depth,
      });
    }
  });

  const seenRender = new Map<string, number>();
  const slugifyRender = (text: string) => {
    let slug = text
      .toLowerCase()
      .replace(/<[^>]+>/g, "")
      .replace(/[^\w\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");
    if (!slug) slug = "section";
    const count = seenRender.get(slug) || 0;
    seenRender.set(slug, count + 1);
    return count > 0 ? `${slug}-${count}` : slug;
  };

  const markedParser = new Marked({
    renderer: {
      heading({ text, depth }) {
        const id = slugifyRender(text);
        return `<h${depth} id="${id}">${text}</h${depth}>\n`;
      },
    },
  });

  const contentHtml = markedParser.parse(rawMarkdown) as string;

  return {
    contentHtml,
    headings,
  };
}

// Helper to get files in directory safely
function getMarkdownFiles(subfolder: string) {
  const dirPath = path.join(contentDirectory, subfolder);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    return [];
  }
  return fs.readdirSync(dirPath).filter((file) => file.endsWith(".md"));
}

export function getAllProjects(): ProjectData[] {
  const files = getMarkdownFiles("projects");
  const projects = files.map((filename) => {
    const slug = filename.replace(/\.md$/, "");
    const fullPath = path.join(contentDirectory, "projects", filename);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);
    const { contentHtml, headings } = parseMarkdownContent(content);

    return {
      slug,
      title: data.title || "Untitled Project",
      description: data.description || "",
      date: data.date || "",
      tags: data.tags || [],
      coverImage: data.coverImage || "/placeholder.jpg",
      featured: !!data.featured,
      githubUrl: data.githubUrl || "",
      liveUrl: data.liveUrl || "",
      contentHtml,
      headings,
    };
  });

  // Sort by date descending
  return projects.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getProjectBySlug(slug: string): ProjectData | null {
  try {
    const fullPath = path.join(contentDirectory, "projects", `${slug}.md`);
    if (!fs.existsSync(fullPath)) return null;

    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);
    const { contentHtml, headings } = parseMarkdownContent(content);

    return {
      slug,
      title: data.title || "Untitled Project",
      description: data.description || "",
      date: data.date || "",
      tags: data.tags || [],
      coverImage: data.coverImage || "/placeholder.jpg",
      featured: !!data.featured,
      githubUrl: data.githubUrl || "",
      liveUrl: data.liveUrl || "",
      contentHtml,
      headings,
    };
  } catch {
    return null;
  }
}

export function getAllBlogPosts(): BlogPostData[] {
  const files = getMarkdownFiles("blog");
  const posts = files.map((filename) => {
    const slug = filename.replace(/\.md$/, "");
    const fullPath = path.join(contentDirectory, "blog", filename);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);
    const { contentHtml, headings } = parseMarkdownContent(content);

    return {
      slug,
      title: data.title || "Untitled Article",
      description: data.description || "",
      date: data.date || "",
      tags: data.tags || [],
      coverImage: data.coverImage || "/placeholder.jpg",
      featured: !!data.featured,
      readTime: data.readTime || "5 min read",
      category: data.category || "General",
      contentHtml,
      headings,
    };
  });

  // Sort by date descending
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getBlogPostBySlug(slug: string): BlogPostData | null {
  try {
    const fullPath = path.join(contentDirectory, "blog", `${slug}.md`);
    if (!fs.existsSync(fullPath)) return null;

    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);
    const { contentHtml, headings } = parseMarkdownContent(content);

    return {
      slug,
      title: data.title || "Untitled Article",
      description: data.description || "",
      date: data.date || "",
      tags: data.tags || [],
      coverImage: data.coverImage || "/placeholder.jpg",
      featured: !!data.featured,
      readTime: data.readTime || "5 min read",
      category: data.category || "General",
      contentHtml,
      headings,
    };
  } catch {
    return null;
  }
}

export interface CategoryInfo {
  name: string;
  slug: string;
  count: number;
}

export function getAllCategories(): CategoryInfo[] {
  const posts = getAllBlogPosts();
  const categoryMap = new Map<string, { name: string; count: number }>();

  posts.forEach((post) => {
    const name = post.category;
    const slug = name.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");
    const existing = categoryMap.get(slug);
    if (existing) {
      existing.count += 1;
    } else {
      categoryMap.set(slug, { name, count: 1 });
    }
  });

  return Array.from(categoryMap.entries()).map(([slug, info]) => ({
    name: info.name,
    slug,
    count: info.count,
  }));
}

export function getBlogPostsByCategory(categorySlug: string): { categoryName: string; posts: BlogPostData[] } {
  const posts = getAllBlogPosts();
  const matchingPosts = posts.filter((post) => {
    const slug = post.category.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");
    return slug === categorySlug.toLowerCase();
  });

  const categoryName = matchingPosts[0]?.category || categorySlug;
  return { categoryName, posts: matchingPosts };
}

export function getRelatedBlogPosts(currentSlug: string, category: string, limit: number = 3): BlogPostData[] {
  const allPosts = getAllBlogPosts().filter((p) => p.slug !== currentSlug);
  const sameCategory = allPosts.filter((p) => p.category.toLowerCase() === category.toLowerCase());
  const otherPosts = allPosts.filter((p) => p.category.toLowerCase() !== category.toLowerCase());
  
  return [...sameCategory, ...otherPosts].slice(0, limit);
}

