import { Student, Teacher, Subject, Schedule, Attendance, User } from '../types/dataTypes';
import pool from '../config/database';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

class MySQLService {
  // Student operations
  async getAllStudents(): Promise<Student[]> {
    const [rows] = await pool.query('SELECT * FROM students');
    return rows as Student[];
  }

  async getStudentById(id: string): Promise<Student | null> {
    const [rows] = await pool.query('SELECT * FROM students WHERE id = ?', [id]);
    const students = rows as Student[];
    return students[0] || null;
  }

  async createStudent(student: Omit<Student, 'id' | 'created_at' | 'updated_at'>): Promise<Student> {
    const id = uuidv4();
    await pool.query(
      'INSERT INTO students (id, student_id, name, class, email) VALUES (?, ?, ?, ?, ?)',
      [id, student.student_id, student.name, student.class, student.email]
    );
    return { id, ...student };
  }

  async updateStudent(id: string, student: Omit<Student, 'id' | 'created_at' | 'updated_at'>): Promise<Student> {
    await pool.query(
      'UPDATE students SET student_id = ?, name = ?, class = ?, email = ? WHERE id = ?',
      [student.student_id, student.name, student.class, student.email, id]
    );
    return { id, ...student };
  }

  async deleteStudent(id: string): Promise<void> {
    await pool.query('DELETE FROM students WHERE id = ?', [id]);
  }

  // User operations
  async createUser(user: { email: string; password: string; name: string; role: string }): Promise<User> {
    const id = uuidv4();
    const hashedPassword = await bcrypt.hash(user.password, 10);
    await pool.query(
      'INSERT INTO users (id, email, password, name, role) VALUES (?, ?, ?, ?, ?)',
      [id, user.email, hashedPassword, user.name, user.role]
    );
    return { id, email: user.email, name: user.name, role: user.role as 'admin' | 'teacher', password: hashedPassword };
  }

  async login(email: string, password: string): Promise<User | null> {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    const users = rows as Array<User & { password: string }>;
    const user = users[0];

    if (!user) return null;

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return null;

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  // Teacher operations
  async getAllTeachers(): Promise<Teacher[]> {
    const [rows] = await pool.query('SELECT * FROM teachers');
    return rows as Teacher[];
  }

  async getTeacherById(id: string): Promise<Teacher | null> {
    const [rows] = await pool.query('SELECT * FROM teachers WHERE id = ?', [id]);
    const teachers = rows as Teacher[];
    return teachers[0] || null;
  }

  async createTeacher(teacher: Omit<Teacher, 'id' | 'created_at' | 'updated_at'>): Promise<Teacher> {
    const id = uuidv4();
    await pool.query(
      'INSERT INTO teachers (id, teacher_id, name, email, subject_id) VALUES (?, ?, ?, ?, ?)',
      [id, teacher.teacher_id, teacher.name, teacher.email, teacher.subject_id]
    );
    return { id, ...teacher };
  }

  async updateTeacher(id: string, teacher: Omit<Teacher, 'id' | 'created_at' | 'updated_at'>): Promise<Teacher> {
    await pool.query(
      'UPDATE teachers SET teacher_id = ?, name = ?, email = ?, subject_id = ? WHERE id = ?',
      [teacher.teacher_id, teacher.name, teacher.email, teacher.subject_id, id]
    );
    return { id, ...teacher };
  }

  async deleteTeacher(id: string): Promise<void> {
    await pool.query('DELETE FROM teachers WHERE id = ?', [id]);
  }

  // Subject operations
  async getAllSubjects(): Promise<Subject[]> {
    const [rows] = await pool.query('SELECT * FROM subjects');
    return rows as Subject[];
  }

  async getSubjectById(id: string): Promise<Subject | null> {
    const [rows] = await pool.query('SELECT * FROM subjects WHERE id = ?', [id]);
    const subjects = rows as Subject[];
    return subjects[0] || null;
  }

  async createSubject(subject: Omit<Subject, 'id' | 'created_at' | 'updated_at'>): Promise<Subject> {
    const id = uuidv4();
    await pool.query(
      'INSERT INTO subjects (id, name, code, description) VALUES (?, ?, ?, ?)',
      [id, subject.name, subject.code, subject.description || null]
    );
    return { id, ...subject };
  }

  async updateSubject(id: string, subject: Omit<Subject, 'id' | 'created_at' | 'updated_at'>): Promise<Subject> {
    await pool.query(
      'UPDATE subjects SET name = ?, code = ?, description = ? WHERE id = ?',
      [subject.name, subject.code, subject.description || null, id]
    );
    return { id, ...subject };
  }

  async deleteSubject(id: string): Promise<void> {
    await pool.query('DELETE FROM subjects WHERE id = ?', [id]);
  }

  // Schedule operations
  async getAllSchedules(): Promise<Schedule[]> {
    const [rows] = await pool.query(`
      SELECT s.*, 
             sub.name as subject_name,
             t.name as teacher_name
      FROM schedules s
      LEFT JOIN subjects sub ON s.subject_id = sub.id
      LEFT JOIN teachers t ON s.teacher_id = t.id
    `);
    return rows as Schedule[];
  }

  async getScheduleById(id: string): Promise<Schedule | null> {
    const [rows] = await pool.query(`
      SELECT s.*, 
             sub.name as subject_name,
             t.name as teacher_name
      FROM schedules s
      LEFT JOIN subjects sub ON s.subject_id = sub.id
      LEFT JOIN teachers t ON s.teacher_id = t.id
      WHERE s.id = ?
    `, [id]);
    const schedules = rows as Schedule[];
    return schedules[0] || null;
  }

  async createSchedule(schedule: Omit<Schedule, 'id' | 'created_at' | 'updated_at'>): Promise<Schedule> {
    const id = uuidv4();
    await pool.query(
      'INSERT INTO schedules (id, subject_id, teacher_id, class, day_of_week, start_time, end_time) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [id, schedule.subject_id, schedule.teacher_id, schedule.class, schedule.day_of_week, schedule.start_time, schedule.end_time]
    );
    return { id, ...schedule };
  }

  async updateSchedule(id: string, schedule: Omit<Schedule, 'id' | 'created_at' | 'updated_at'>): Promise<Schedule> {
    await pool.query(
      'UPDATE schedules SET subject_id = ?, teacher_id = ?, class = ?, day_of_week = ?, start_time = ?, end_time = ? WHERE id = ?',
      [schedule.subject_id, schedule.teacher_id, schedule.class, schedule.day_of_week, schedule.start_time, schedule.end_time, id]
    );
    return { id, ...schedule };
  }

  async deleteSchedule(id: string): Promise<void> {
    await pool.query('DELETE FROM schedules WHERE id = ?', [id]);
  }

  // Attendance operations
  async getAllAttendances(): Promise<Attendance[]> {
    const [rows] = await pool.query(`
      SELECT a.*,
             s.name as student_name,
             sch.class,
             sub.name as subject_name
      FROM attendance a
      LEFT JOIN students s ON a.student_id = s.id
      LEFT JOIN schedules sch ON a.schedule_id = sch.id
      LEFT JOIN subjects sub ON sch.subject_id = sub.id
    `);
    return rows as Attendance[];
  }

  async createAttendance(attendance: Omit<Attendance, 'id' | 'created_at' | 'updated_at'>): Promise<Attendance> {
    const id = uuidv4();
    await pool.query(
      'INSERT INTO attendance (id, schedule_id, student_id, date, status, notes) VALUES (?, ?, ?, ?, ?, ?)',
      [id, attendance.schedule_id, attendance.student_id, attendance.date, attendance.status, attendance.notes || null]
    );
    return { id, ...attendance };
  }

  async updateAttendance(id: string, attendance: Omit<Attendance, 'id' | 'created_at' | 'updated_at'>): Promise<Attendance> {
    await pool.query(
      'UPDATE attendance SET schedule_id = ?, student_id = ?, date = ?, status = ?, notes = ? WHERE id = ?',
      [attendance.schedule_id, attendance.student_id, attendance.date, attendance.status, attendance.notes || null, id]
    );
    return { id, ...attendance };
  }

  async deleteAttendance(id: string): Promise<void> {
    await pool.query('DELETE FROM attendance WHERE id = ?', [id]);
  }

  // Helper methods
  async getAttendancesBySchedule(scheduleId: string): Promise<Attendance[]> {
    const [rows] = await pool.query('SELECT * FROM attendance WHERE schedule_id = ?', [scheduleId]);
    return rows as Attendance[];
  }

  async getAttendancesByStudent(studentId: string): Promise<Attendance[]> {
    const [rows] = await pool.query('SELECT * FROM attendance WHERE student_id = ?', [studentId]);
    return rows as Attendance[];
  }

  async getAttendancesByDate(date: string): Promise<Attendance[]> {
    const [rows] = await pool.query('SELECT * FROM attendance WHERE date = ?', [date]);
    return rows as Attendance[];
  }

  async getAttendanceReport(startDate: string, endDate: string, subjectId?: string, studentId?: string): Promise<any[]> {
    let query = `
      SELECT 
        a.*,
        s.name as student_name,
        s.student_id,
        s.class,
        sub.name as subject_name,
        t.name as teacher_name
      FROM attendance a
      LEFT JOIN students s ON a.student_id = s.id
      LEFT JOIN schedules sch ON a.schedule_id = sch.id
      LEFT JOIN subjects sub ON sch.subject_id = sub.id
      LEFT JOIN teachers t ON sch.teacher_id = t.id
      WHERE a.date BETWEEN ? AND ?
    `;

    const params: any[] = [startDate, endDate];

    if (subjectId) {
      query += ' AND sub.id = ?';
      params.push(subjectId);
    }

    if (studentId) {
      query += ' AND s.id = ?';
      params.push(studentId);
    }

    const [rows] = await pool.query(query, params);
    return rows as any[];
  }
}

export const mysqlService = new MySQLService();
