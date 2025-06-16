
-- First, drop existing tables with CASCADE to remove dependencies
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS students CASCADE;
DROP TABLE IF EXISTS teachers CASCADE;
DROP TABLE IF EXISTS subjects CASCADE;
DROP TABLE IF EXISTS schedules CASCADE;
DROP TABLE IF EXISTS attendances CASCADE;
DROP TABLE IF EXISTS admins CASCADE;

-- Create tables with the correct schema
CREATE TABLE students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  student_id TEXT NOT NULL,
  class TEXT NOT NULL,
  email TEXT NOT NULL,
  password TEXT NOT NULL DEFAULT '123456'
);

CREATE TABLE teachers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  teacher_id TEXT NOT NULL,
  email TEXT NOT NULL,
  subjects TEXT[] DEFAULT '{}',
  password TEXT NOT NULL DEFAULT '123456'
);

CREATE TABLE admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  password TEXT NOT NULL
);

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL,
  role_id UUID NOT NULL
);

CREATE TABLE subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  teacher_id UUID
);

CREATE TABLE schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id UUID,
  teacher_id UUID,
  class TEXT NOT NULL,
  day_of_week TEXT NOT NULL,
  start_time TEXT NOT NULL,
  end_time TEXT NOT NULL,
  room_number TEXT NOT NULL
);

CREATE TABLE attendances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID,
  schedule_id UUID,
  subject_id UUID,
  date TEXT NOT NULL,
  status TEXT NOT NULL,
  timestamp TEXT NOT NULL
);

-- Insert initial admin user
INSERT INTO admins (name, email, password)
VALUES ('Admin Utama', 'admin@example.com', 'admin123');

-- Insert initial user for admin
INSERT INTO users (name, email, password, role, role_id)
SELECT name, email, password, 'admin', id
FROM admins
WHERE email = 'admin@example.com';

-- Insert some sample teachers
INSERT INTO teachers (name, teacher_id, email, subjects, password)
VALUES 
  ('Siti Rahayu', 'T001', 'siti.rahayu@example.com', ARRAY['Matematika', 'Fisika'], '123456'),
  ('Budi Santoso', 'T002', 'budi.santoso@example.com', ARRAY['Bahasa Indonesia', 'Bahasa Inggris'], '123456');

-- Insert users for teachers
INSERT INTO users (name, email, password, role, role_id)
SELECT name, email, password, 'teacher', id
FROM teachers;

-- Insert some sample students
INSERT INTO students (name, student_id, class, email, password)
VALUES 
  ('Ahmad Farizi', 'S001', 'XI-A', 'ahmad.farizi@example.com', '123456'),
  ('Dewi Lestari', 'S002', 'XI-B', 'dewi.lestari@example.com', '123456'),
  ('Budi Santoso', 'S003', 'XI-A', 'budi.santoso@example.com', '123456'),
  ('Dewi Lestari', 'S004', 'XI-B', 'dewi.lestari2@example.com', '123456'),
  ('Fajar Nugroho', 'S005', 'XI-B', 'fajar.nugroho@example.com', '123456'),
  ('Indah Permata', 'S006', 'XI-B', 'indah.permata@example.com', '123456'),
  ('Eko Purnomo', 'S007', 'XI-C', 'eko.purnomo@example.com', '123456');

-- Insert users for students
INSERT INTO users (name, email, password, role, role_id)
SELECT name, email, password, 'student', id
FROM students;

-- Insert more sample teachers
INSERT INTO teachers (name, teacher_id, email, subjects, password)
VALUES 
  ('Dr. Bambang Wijaya', 'T003', 'bambang.wijaya@example.com', ARRAY['Matematika', 'Fisika'], '123456'),
  ('Sri Wahyuni, M.Pd', 'T004', 'sri.wahyuni@example.com', ARRAY['Bahasa Indonesia', 'Bahasa Inggris'], '123456'),
  ('Agus Susanto, S.Kom', 'T005', 'agus.susanto@example.com', ARRAY['Informatika', 'Pemrograman'], '123456'),
  ('Rina Puspita, M.Si', 'T006', 'rina.puspita@example.com', ARRAY['Kimia', 'Biologi'], '123456');

-- Insert users for additional teachers
INSERT INTO users (name, email, password, role, role_id)
SELECT name, email, password, 'teacher', id
FROM teachers 
WHERE teacher_id IN ('T003', 'T004', 'T005', 'T006');

-- Insert subjects
INSERT INTO subjects (name, code)
VALUES
  ('Matematika', 'MAT'),
  ('Fisika', 'FIS'),
  ('Bahasa Indonesia', 'BIN'),
  ('Bahasa Inggris', 'BIG'),
  ('Informatika', 'INF'),
  ('Kimia', 'KIM'),
  ('Biologi', 'BIO');
