# JV Ice Hockey Academy London: jvhockey.com

A fast static website built with plain HTML, CSS and a little JavaScript. There's no build step, no database and nothing to update or patch. It's hosted free on **GitHub Pages**.

```
index.html               Home
childrens-hockey.html    Children's Hockey
adult-hockey.html        Adult Hockey
camps-clinics.html       Camps & Clinics
about.html               About Us
blog.html                Blog list
blog/                    Blog posts (+ _post-template.html, not published)
contact.html             Contact + enquiry form
policies.html            Policies & Safety (footer links point here)
css/style.css            All styling (brand colours at the top)
js/main.js               Mobile menu, animations, enquiry form
images/                  Photos & logos (see images/README.txt for file names)
docs/                    Policy PDFs (linked from policies.html)
sitemap.xml, robots.txt  For Google
404.html                 "Page not found" page
```

---

## Before launch checklist

Search the files for `CONFIRM` to find each of these in place.

- [x] **Logos**: crest, mascot wordmark and monogram favicon were cut from the brand guide PDF. If the designer can supply the original logo files (SVG/PNG), swap them in with the same file names for the sharpest result.
- [ ] **Photos**: add approved photos to `images/` (names in `images/README.txt`). Check photo permission for every identifiable child.
- [x] **Brand guide** `JV-Ice-Hockey-Academy_CGP.pdf` stays on the PC only (listed in `.gitignore`, together with `_concepts/` and `_backup-v2/`).
- [x] **Spond**: every Register / Join button (children and adults) uses `https://club.spond.com/landing/signup/jvicehockey/`.
- [ ] **Age groups**: confirm U7 birth years, U18 Development eligibility and whether U16 runs in 2026/2027 (`childrens-hockey.html`).
- [ ] **Enquiry form**: sends to `info@jvhockey.com` through FormSubmit (formsubmit.co, no account needed). The **first** enquiry sends an activation email to that inbox; click **Activate Form** once, then send a test enquiry.
- [ ] **Policy PDFs**: published from `docs/`. Review the 2025/2026 Terms. Update the Privacy Notice to mention the website, GitHub Pages hosting, the FormSubmit enquiry form and Spond links.
- [ ] **Safeguarding policy & cancellation policy**: add approved wording to `policies.html`.
- [x] **Email**: the site uses `info@jvhockey.com` everywhere, including the enquiry form.
- [ ] **Blog post**: review the equipment post before launch.
- [ ] **Fonts**: headings use Copperplate Gothic where the visitor's device has it (Macs, iPhones, PCs with Office). Everyone else sees Cinzel, a free look-alike. To always show Copperplate, buy a webfont licence and add the font files (ask Claude to wire it up).

---

## Preview on your computer

Double-click `index.html` to open it in your browser. Everything except the enquiry form works this way.

---

## Publish on GitHub Pages

1. Create a free account at **github.com** (keep it under the academy's control).
2. Click **+ → New repository**, name it `jviha-website`, set it to **Public**, and click **Create repository**.
3. Click **uploading an existing file**, drag in **everything inside this folder** (not the folder itself), and click **Commit changes**.
4. Go to **Settings → Pages**. Under *Source* choose **Deploy from a branch**, branch **main**, folder **/ (root)**, then click **Save**.
5. After about a minute the site is live at `https://YOUR-USERNAME.github.io/jviha-website/`.

### Connect jvhockey.com

1. In **Settings → Pages → Custom domain**, type `jvhockey.com` and click **Save**.
2. At the company where jvhockey.com is registered, open the DNS settings and add:

   | Type  | Name  | Value                    |
   |-------|-------|--------------------------|
   | A     | @     | 185.199.108.153          |
   | A     | @     | 185.199.109.153          |
   | A     | @     | 185.199.110.153          |
   | A     | @     | 185.199.111.153          |
   | CNAME | www   | YOUR-USERNAME.github.io  |

   Remove any other A records for `@`. Don't touch MX records (those are for email).
3. Wait for DNS to update (from minutes up to 24 hours), then tick **Enforce HTTPS** in Settings → Pages.
4. Add the site to **Google Search Console** (search.google.com/search-console), verify the domain and submit `https://jvhockey.com/sitemap.xml`. Also create or claim a **Google Business Profile**, which matters a lot for local searches.

---

## Updating the website

Edit files directly on github.com: open the file, click the ✏️ pencil, make the change, then click **Commit changes**. The live site updates in about a minute.

- **Change text**: find the sentence in the right `.html` file and edit it. Leave the `<tags>` alone and change only the words between them.
- **Change a photo**: upload a new file with the **same name** into `images/` (Add file → Upload files). It replaces the old one.
- **Add a camp**: in `camps-clinics.html`, follow the "HOW TO ADD A CAMP" note. Copy the example block, fill it in, and delete the "Upcoming camps" placeholder box. Remove old camps when they're over.
- **Add a coach**: in `about.html`, follow the "HOW TO ADD A COACH" note.
- **Add a blog post**:
  1. Copy `blog/_post-template.html` and give the copy a short name with dashes, e.g. `blog/summer-camp-2027.html`.
  2. Replace every CAPITALISED placeholder (title, summary, date, file name) and write the post.
  3. In `blog.html`, copy a post card, put it **first** in the list, and update its link, date, title and summary.
  4. Add the new address to `sitemap.xml`.
- **Change brand colours**: they're at the top of `css/style.css`.
- **Header, footer & menu** live once in `_layout/` (`header.html`, `footer.html`, `head.html`). After editing one of them, copy it into every page by running:

  ```powershell
  powershell -ExecutionPolicy Bypass -File _layout\sync.ps1
  ```

  Don't edit the parts of a page between `<!-- @header -->` and `<!-- /@header -->` (or `@head` / `@footer`) by hand, because the next sync overwrites them. Without a Windows PC, edit the menu in each page directly. (`_layout` isn't published.)
- **Decorations**: hockey icons live in `images/icons/`. Each page uses them as `<img class="deco" ...>` with a position, size and opacity, so you can move them or remove them.
