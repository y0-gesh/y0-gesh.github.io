export const seoConfig = {
  siteName: "Yogesh Tandan | Software Engineering Portfolio",
  siteUrl: "https://yogeshtandan.in",
  defaultTitle: "Yogesh Tandan | Software Engineer & Multi-Tenant SaaS Developer",
  titleTemplate: "%s | Yogesh Tandan",
  defaultDescription:
    "Portfolio and engineering chronicles of Yogesh Tandan — Software Engineer at eigenstudio specializing in Next.js, multi-tenant SaaS interfaces, 3D engines, and AWS/Terraform CI/CD pipelines.",
  authorName: "Yogesh Tandan",
  jobTitle: "Software Engineer",
  company: "eigenstudio",
  previousCompany: "Avkalan Labs",
  twitterHandle: "@y0_gesh_",
  defaultOgImage: "https://yogeshtandan.in/images/blog-3.png",
  socialLinks: {
    github: "https://github.com/y0-gesh",
    linkedin: "https://www.linkedin.com/in/yogesh-tandan",
    twitter: "https://x.com/y0_gesh_",
  },
};

export function absoluteUrl(path: string): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${seoConfig.siteUrl}${cleanPath}`;
}

export function slugifyTag(tag: string): string {
  return tag
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}
