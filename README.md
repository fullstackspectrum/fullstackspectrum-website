# fullstackspectrum.com

Source code for the Full-Stack-Spectrum website, hosted on GitHub Pages at [fullstackspectrum.com](https://fullstackspectrum.com).

It's a static site in plain HTML, CSS and JavaScript, with no build step. Pushes to `main` are published automatically.

## Writing a blog post

1. Start a post on a branch: `python3 scripts/new_post.py my-new-post "My new post"`
2. Write the `<meta name="description">` (used as the excerpt), the body and the read time in `blog/my-new-post.html`.
3. Preview with `python3 -m http.server 8000` and open http://localhost:8000/blog/.
4. Open a PR. Once it's merged, the **Update blog index** workflow rebuilds `assets/js/posts.js` and the post appears on the homepage and `/blog/`.

Don't edit `assets/js/posts.js` by hand; it's generated from the posts. To hide a post, add `<meta name="robots" content="noindex">` to its `<head>`. To list a post hosted elsewhere, add it to `blog/external-posts.json` with `title`, `date`, `excerpt` and `url`.
