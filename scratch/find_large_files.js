const fs = require('fs');
const path = require('path');

function getLargeFiles(dir, thresholdBytes) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    if (fullPath.includes('node_modules') || fullPath.includes('.next') || fullPath.includes('.git')) {
      return;
    }
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getLargeFiles(fullPath, thresholdBytes));
    } else {
      if (stat.size > thresholdBytes) {
        results.push({
          path: path.relative(process.cwd(), fullPath),
          sizeKB: (stat.size / 1024).toFixed(2)
        });
      }
    }
  });
  return results;
}

const threshold = 100 * 1024; // 100KB
const largeFiles = getLargeFiles(process.cwd(), threshold);
largeFiles.sort((a, b) => parseFloat(b.sizeKB) - parseFloat(a.sizeKB));

console.log(JSON.stringify(largeFiles, null, 2));
