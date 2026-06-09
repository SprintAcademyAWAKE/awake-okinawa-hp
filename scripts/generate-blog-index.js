const fs = require('fs');
const path = require('path');

const postsDir = path.join(__dirname, '..', 'posts');
const outputJson = path.join(__dirname, '..', 'posts-index.json');

function parseFrontMatter(content) {
  const match = content.match(/^---\r?\n([\s\S]+?)\r?\n---/);
  if (!match) return { metadata: {}, body: content };
  
  const yamlContent = match[1];
  const metadata = {};
  
  yamlContent.split(/\r?\n/).forEach(line => {
    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      const key = line.slice(0, colonIndex).trim();
      let value = line.slice(colonIndex + 1).trim();
      
      // Strip outer quotes from value if present
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      metadata[key] = value;
    }
  });
  
  return metadata;
}

function generateIndex() {
  console.log('Generating blog index...');
  
  if (!fs.existsSync(postsDir)) {
    console.log(`Directory ${postsDir} does not exist. Creating it.`);
    fs.mkdirSync(postsDir);
    fs.writeFileSync(outputJson, '[]');
    return;
  }
  
  const files = fs.readdirSync(postsDir);
  const posts = [];
  
  files.forEach(file => {
    if (path.extname(file).toLowerCase() === '.md') {
      const filePath = path.join(postsDir, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      const metadata = parseFrontMatter(content);
      
      if (!metadata.title) {
        console.warn(`Warning: File ${file} is missing title in front-matter. Skipping.`);
        return;
      }
      
      const postId = path.basename(file, '.md');
      posts.push({
        id: postId,
        title: metadata.title,
        date: metadata.date || new Date().toISOString().split('T')[0],
        category: metadata.category || '未分類',
        description: metadata.description || '',
        thumbnail: metadata.thumbnail || 'assets/hero-bg.png'
      });
    }
  });
  
  // Sort posts by date descending
  posts.sort((a, b) => new Date(b.date) - new Date(a.date));
  
  fs.writeFileSync(outputJson, JSON.stringify(posts, null, 2), 'utf-8');
  console.log(`Successfully generated index with ${posts.length} posts at ${outputJson}`);
}

generateIndex();
