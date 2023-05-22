-- tạo bảng users
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL
);

-- tạo bảng group
CREATE TABLE groups (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);

-- tạo bảng chung gian quan hệ n - n
CREATE TABLE user_group (
  user_id INT NOT NULL,
  group_id INT NOT NULL,
  PRIMARY KEY (user_id, group_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE
);

-- Chèn dữ liệu vào bảng users
INSERT INTO users (name, email, password) VALUES
  ('John Doe', 'john@example.com', 'password1'),
  ('Jane Smith', 'jane@example.com', 'password2'),
  ('David Johnson', 'david@example.com', 'password3'),
  ('Emily Williams', 'emily@example.com', 'password4');

-- Chèn dữ liệu vào bảng groups
INSERT INTO groups (name) VALUES
  ('Sales'),
  ('Marketing'),
  ('Engineering'),
  ('Finance');

CREATE TABLE books (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  author_id INT,
  FOREIGN KEY (author_id) REFERENCES users(id)
);

-- Chèn dữ liệu vào bảng user_group
INSERT INTO user_group (user_id, group_id) VALUES
  (1, 1),
  (2, 1),
  (2, 2),
  (3, 2),
  (3, 3),
  (4, 3),
  (1, 4),
  (2, 4),
  (3, 4),
  (4, 4);

INSERT INTO books (name, title, author_id) VALUES
  ('Sách Kinh Doanh', 'Kỹ năng làm việc trong môi trường kinh doanh', 1),
  ('Sách Khoa Học', 'Nguyên lý Vũ trụ', 2),
  ('Sách Văn Học', 'Cô Gái Đến Từ Hôm Qua', 3),
  ('Sách Lịch Sử', 'Cuộc Đời Và Sự Nghiệp Bác Hồ', 4),
  ('Sách Kỹ Năng Sống', '7 Thói Quen Hiệu Quả', 1),
  ('Sách Khoa Học', 'Nhân Loại Học', 2),
  ('Sách Văn Học', 'Truyện Kiều', 3),
  ('Sách Lịch Sử', 'Lược Sử Thế Giới', 4),
  ('Sách Kinh Doanh', 'Triết Lý Kinh Doanh', 1),
  ('Sách Kỹ Năng Sống', 'Đắc Nhân Tâm', 2);