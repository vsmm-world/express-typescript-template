const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..', 'src', 'views');
const destDir = path.join(__dirname, '..', 'dist', 'src', 'views');

// Create destination directory if it doesn't exist
if (!fs.existsSync(path.join(__dirname, '..', 'dist', 'src'))) {
  fs.mkdirSync(path.join(__dirname, '..', 'dist', 'src'), { recursive: true });
}

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

// Copy files
if (fs.existsSync(srcDir)) {
  const files = fs.readdirSync(srcDir);
  files.forEach(file => {
    const srcPath = path.join(srcDir, file);
    const destPath = path.join(destDir, file);
    fs.copyFileSync(srcPath, destPath);
    console.log(`Copied ${file} to dist/src/views/`);
  });
  console.log('Views folder copied successfully!');
} else {
  console.error('Source views directory not found:', srcDir);
  process.exit(1);
}

