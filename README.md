# lakehousetools.com

The Lakehouse Tools website, built with [Astro](https://astro.build) and deployed to DigitalOcean App Platform from `main`.

## Local development

```bash
npm install
npm run dev        # http://localhost:4321, reloads as you edit
npm run build      # static site in dist/
```

## Writing a blog post

1. Create `src/content/blog/<url-slug>.md`. The file name becomes the URL: `/blog/<url-slug>/`.
2. Start it with front matter:
   ```yaml
   ---
   title: "Post title"
   description: "One or two sentences. Shown under the title, in the post list, RSS and social previews."
   date: 2026-10-03
   tags: [salesforce, snowflake]
   image: /blog/<url-slug>/diagram.png   # optional; used for social previews
   draft: true                           # optional; drafts are not published
   ---
   ```
3. Put images in `public/blog/<url-slug>/` and reference them as `/blog/<url-slug>/file.png`.
4. Run `npm run build` to check it, then open a pull request. Merging to `main` publishes it.

The blog list, home page "From the blog" section, RSS feed (`/rss.xml`) and sitemap update automatically.

## Deployment (DigitalOcean App Platform)

- Component type: Static Site
- Build command: `npm run build`
- Output directory: `dist`
