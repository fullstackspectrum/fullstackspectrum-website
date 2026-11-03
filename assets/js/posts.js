/*
 * Blog post index — the single list both the homepage and /blog/ read from.
 *
 * To add a post:
 *   1. Copy blog/_template.html to blog/<your-slug>.html and write it.
 *   2. Add an entry at the TOP of this list.
 *
 * To link a post hosted elsewhere (Medium, dev.to, Hashnode, Substack...),
 * set `url` to the full external link and `external: true` — no HTML file needed.
 */
window.POSTS = [
  {
    title: "Hello, world: why Full-Stack-Spectrum exists",
    date: "2026-11-03",
    excerpt: "Scanner output is noisy. Here's the thinking behind the tools, and what's coming next.",
    url: "/blog/hello-world.html"
  }
  // Example external post:
  // {
  //   title: "Tracing blast radius with Forgely",
  //   date: "2026-11-10",
  //   excerpt: "Cross-posted on dev.to",
  //   url: "https://dev.to/yourname/your-post",
  //   external: true
  // },
];
