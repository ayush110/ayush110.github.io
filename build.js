const fs = require('fs');
const path = require('path');
const { marked } = require('marked');
const matter = require('gray-matter');

const WRITINGS_DIR = path.join(__dirname, 'src', 'content', 'writings');
const TEMPLATE_FILE = path.join(__dirname, 'src', 'index.html');
const OUTPUT_FILE = path.join(__dirname, 'index.html');

function build() {
  console.log('Building site...');
  
  // Read all markdown files
  const files = fs.readdirSync(WRITINGS_DIR).filter(file => file.endsWith('.md'));
  
  const writings = [];
  
  for (const file of files) {
    const rawContent = fs.readFileSync(path.join(WRITINGS_DIR, file), 'utf-8');
    const parsed = matter(rawContent);

    if (parsed.data.draft === true) {
      continue;
    }
    
    writings.push({
      title: parsed.data.title || file.replace('.md', ''),
      date: parsed.data.date || '',
      content: marked.parse(parsed.content)
    });
  }

  // Sort writings by date (assuming MM/YYYY) - descending
  writings.sort((a, b) => {
    const [aMonth, aYear] = a.date.split('/');
    const [bMonth, bYear] = b.date.split('/');
    return new Date(bYear, bMonth - 1) - new Date(aYear, aMonth - 1);
  });

  // Read template and inject
  let template = fs.readFileSync(TEMPLATE_FILE, 'utf-8');
  template = template.replace('/* WRITINGS_ARRAY_PLACEHOLDER */', JSON.stringify(writings));
  
  // Write output
  fs.writeFileSync(OUTPUT_FILE, template);
  console.log('Build complete. Output written to index.html');
}

build();
