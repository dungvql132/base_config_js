import globby from 'globby';
import { CLIEngine } from 'eslint.mjs';

// Cấu hình ESLint
const eslintConfig = {
  // Cấu hình quy tắc của bạn
};

// Lấy danh sách tệp tin JavaScript trong thư mục src
const files = globby.sync(['src/**/*.js']);

// Tạo một instance của ESLint
const eslint = new CLIEngine(eslintConfig);

// Kiểm tra các tệp tin bằng ESLint
const report = eslint.executeOnFiles(files);

// Hiển thị kết quả
const formatter = eslint.getFormatter();
console.log(formatter(report.results));
