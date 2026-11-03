# fullstackspectrum.com

Static site: plain HTML/CSS/JS, no build step.

```
index.html            homepage (hero, projects, about, latest posts, contact)
blog/index.html       all posts
blog/hello-world.html example post
blog/_template.html   copy this for new posts (blocked from public view by .htaccess)
404.html
.htaccess             HTTPS + www redirect, 404 page, caching (Apache/GoDaddy)
assets/css/style.css
assets/js/main.js     nav, filters, copy buttons, live GitHub stars, post lists
assets/js/posts.js    the post index used by the homepage and /blog/
assets/img/           favicon + social share image
```

## Preview locally

```sh
python3 -m http.server 8000
# open http://localhost:8000
```

## Writing a post

1. `cp blog/_template.html blog/my-post.html`, then replace `POST TITLE`, `SLUG`, the date and the body.
2. Add an entry to the top of `assets/js/posts.js`.

To list a post hosted on Medium, dev.to, Hashnode or another site instead, add it to `posts.js` with the full `url` and `external: true`. You don't need an HTML file for it.

## Adding a project

Copy one `<article class="card">` block in `index.html`. `data-repo` must match the GitHub repo name (for live stars), `data-tags` drives the filters, and `--accent` picks the spectrum colour.

## Deploying to GoDaddy

**cPanel / Linux web hosting:**
1. GoDaddy → My Products → Web Hosting → **Manage** → **cPanel Admin** → **File Manager**.
2. Open `public_html/` (delete the GoDaddy placeholder `index.html` if there is one).
3. Upload everything in this folder **except** `.git/` and `README.md`. Keep the folder structure. Turn on *Settings → Show hidden files* so you can see `.htaccess`.
4. In cPanel → **SSL/TLS Status**, make sure the free AutoSSL certificate is active for the domain, then visit https://fullstackspectrum.com.

Zip shortcut: `zip -r site.zip . -x '.git/*' README.md`, then upload `site.zip` in File Manager and **Extract** it into `public_html/`.

**Domain only (no GoDaddy hosting):** host it for free on GitHub Pages, Netlify or Cloudflare Pages, then point GoDaddy DNS at that host. For GitHub Pages:
- `A` records for `@`: 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153
- `CNAME` for `www`: `fullstackspectrum.github.io`

GitHub Pages ignores `.htaccess` but serves `404.html` automatically.
