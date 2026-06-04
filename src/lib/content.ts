import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";

const contentDirectory = path.join(process.cwd(), "content");

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
      contentHtml: marked.parse(content) as string,
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
      contentHtml: marked.parse(content) as string,
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
      contentHtml: marked.parse(content) as string,
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
      contentHtml: marked.parse(content) as string,
    };
  } catch {
    return null;
  }
}
