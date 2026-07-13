import fs from 'fs';
import path from 'path';

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

const targetDir = 'y:\\BYREEN\\storefront\\src';

walkDir(targetDir, (filePath) => {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if the file imports next/image
    if (content.includes('next/image')) {
      let modified = false;
      
      // Look for <Image ...> tags that don't already have unoptimized
      // This is a simple regex that finds <Image and adds unoptimized
      const newContent = content.replace(/<Image(?!\s+unoptimized)([\s\>])/g, (match, p1) => {
        modified = true;
        return `<Image unoptimized${p1}`;
      });

      if (modified) {
        fs.writeFileSync(filePath, newContent, 'utf8');
        console.log(`Updated ${filePath}`);
      }
    }
  }
});
console.log('Done updating images.');
