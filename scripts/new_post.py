#!/usr/bin/env python3
"""Start a new blog post from blog/_template.html.

Usage:
  python3 scripts/new_post.py my-new-post "My new post"

Creates blog/my-new-post.html with the title, slug and today's date filled in.
You still write the description and the body. The post is listed automatically
once it's merged into main (see scripts/build_posts.py).
"""
import html
import re
import sys
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TEMPLATE = ROOT / "blog" / "_template.html"


def main():
    if len(sys.argv) != 3:
        sys.exit(__doc__.strip())
    slug, title = sys.argv[1], sys.argv[2]
    if not re.fullmatch(r"[a-z0-9]+(-[a-z0-9]+)*", slug):
        sys.exit(f"Slug must be lowercase words joined by hyphens, e.g. my-new-post (got {slug!r})")

    target = ROOT / "blog" / f"{slug}.html"
    if target.exists():
        sys.exit(f"{target.relative_to(ROOT)} already exists")

    today = date.today()
    content = (TEMPLATE.read_text(encoding="utf-8")
               .replace("POST TITLE", html.escape(title, quote=False))
               .replace("SLUG", slug)
               .replace('datetime="2026-01-01">01 Jan 2026',
                        f'datetime="{today.isoformat()}">{today.strftime("%d %b %Y")}'))
    target.write_text(content, encoding="utf-8")

    print(f"Created {target.relative_to(ROOT)}")
    print("Next: write the <meta name=\"description\"> (it's the excerpt), the body, and the read time.")


if __name__ == "__main__":
    main()
