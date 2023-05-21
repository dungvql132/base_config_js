const path = require('path');
const moduleAlias = require('module-alias');

// Đường dẫn đến thư mục gốc của dự án
const basePath = path.join(__dirname, '..');

// Định nghĩa các alias cho đường dẫn tương đối
moduleAlias.addAliases({
  '@src': path.join(basePath, 'src'),
  // Thêm các alias khác tùy ý
});