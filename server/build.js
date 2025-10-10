const fs = require('fs-extra');
const path = require('path');

// 确保dist目录存在
const distDir = path.join(__dirname, 'dist');
const publicDir = path.join(distDir, 'public');

// 创建public目录（如果不存在）
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// 复制前端构建文件到server的public目录
const frontBuildDir = path.join(__dirname, '..', 'front', 'dist');
if (fs.existsSync(frontBuildDir)) {
  fs.copySync(frontBuildDir, publicDir);
  console.log('Frontend build files copied to server public directory');
} else {
  console.warn('Frontend build directory not found. Run "pnpm run build" in front directory first.');
}
