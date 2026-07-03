# Ayush Shah - Personal Website

This is the source code for my minimal, personal website. It is designed to be a lightweight, single-page application built from simple Markdown files.

## Architecture

The site uses a tiny custom Node.js build script to read Markdown files from `src/content/writings/`, convert them, and inject them into `src/index.html`. This ensures the final output is a single, lightning-fast `index.html` file that is SEO friendly and doesn't require complex client-side fetching or heavy JavaScript frameworks.

## How to add a new post

1. Create a new `.md` file inside `src/content/writings/`.
2. Add the required metadata (frontmatter) at the very top of your file:
   ```markdown
   ---
   title: My Awesome New Post
   date: 07/2026
   ---
   ```
3. Write your content in standard Markdown below the metadata block.

## How to Build

If you are running this for the first time, install the dependencies:
```bash
npm install
```

Whenever you add or update a markdown file, compile the site by running:
```bash
npm run build
```

This will run the `build.js` script, compile all your markdown, and generate a fresh `index.html` file in the root directory.

## Testing Locally

Because the output is a standard `index.html` file, you can preview it locally by just double clicking the file or opening it in your browser:
```bash
open index.html
```
