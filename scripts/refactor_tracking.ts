import * as fs from 'fs';
import * as path from 'path';

function walkDir(dir: string, callback: (path: string) => void) {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
  });
}

walkDir('./src', (filePath) => {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Remove trackPageView function calls across pages
    if (filePath.includes('/pages/')) {
       content = content.replace(/^[ \t]*trackPageView\s*\([^)]*\);?\s*$/gm, '');
       content = content.replace(/trackPageView,\s*/g, '');
       content = content.replace(/,\s*trackPageView/g, '');
       content = content.replace(/import { trackPageView } from /g, 'import { } from ');
       // Clean up empty imports
       content = content.replace(/import\s*{\s*}\s*from\s*['"][.+/]+amplitude['"];?\n/g, '');
    }
    
    fs.writeFileSync(filePath, content, 'utf8');
  }
});

