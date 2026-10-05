// README.md の BLOG-POST-LIST マーカー間を、ブログ記事一覧で更新する。
// 使い方: node scripts/update-blog-posts.js [blogContentDir] [readmePath]
const fs = require('fs');
const path = require('path');

const root = process.argv[2] || '.blog-source/src/content/blog';
const readmePath = process.argv[3] || 'README.md';

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

const stripQuotes = (value) => value.trim().replace(/^["']|["']$/g, '');
const escapeMarkdown = (value) => value.replace(/([\\[\]])/g, '\\$1');

const posts = walk(root)
  .filter((file) => file.endsWith('.md'))
  .map((file) => {
    const text = fs.readFileSync(file, 'utf8');
    const frontmatter = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (!frontmatter) return null;

    const title = frontmatter[1].match(/^title:\s*(.+)$/m);
    const pubDate = frontmatter[1].match(/^pubDate:\s*(.+)$/m);
    if (!title || !pubDate) return null;

    const id = path
      .relative(root, file)
      .replace(/\\/g, '/')
      .replace(/\.md$/, '');

    return {
      id,
      title: stripQuotes(title[1]),
      pubDate: stripQuotes(pubDate[1]),
    };
  })
  .filter(Boolean)
  .sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate))
  .slice(0, 5);

const list = posts
  .map((post) => {
    const url = `https://morimori.cloud/blog/posts/${encodeURI(post.id)}/`;
    return `- \`${post.pubDate}\` [${escapeMarkdown(post.title)}](${url})`;
  })
  .join('\n');

const start = '<!-- BLOG-POST-LIST:START -->';
const end = '<!-- BLOG-POST-LIST:END -->';
let readme = fs.readFileSync(readmePath, 'utf8');
const pattern = new RegExp(`${start}[\\s\\S]*?${end}`);

if (!pattern.test(readme)) {
  throw new Error('Blog post markers were not found in README.md');
}

readme = readme.replace(pattern, `${start}\n${list}\n${end}`);
fs.writeFileSync(readmePath, readme);
