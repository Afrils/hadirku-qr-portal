
import { Student, Teacher, Subject, Schedule, Attendance, Admin, User } from '../types/dataTypes';

// Mock data for initial state
export const initialStudents: Student[] = [
  {
    id: '1',
    studentId: 'S001',
    name: 'Ahmad Farizi',
    class: 'XII IPA 1',
    email: 'ahmad.farizi@example.com',
    password: '123456',
  },
  {
    id: '2',
    studentId: 'S002',
    name: 'Diah Purnama',
    class: 'XII IPA 1',
    email: 'diah.p@example.com',
    password: '123456',
  },
  {
    id: '3',
    studentId: 'S003',
    name: 'Budi Santoso',
    class: 'XII IPS 2',
    email: 'budi.santoso@example.com',
    password: '123456',
  },
];

export const initialTeachers: Teacher[] = [
  {
    id: '1',
    teacherId: 'T001',
    name: 'Siti Rahayu',
    email: 'siti.rahayu@example.com',
    subjects: ['Matematika', 'Fisika'],
    password: '123456',
  },
  {
    id: '2',
    teacherId: 'T002',
    name: 'Bambang Wijaya',
    email: 'bambang.w@example.com',
    subjects: ['Kimia'],
    password: '123456',
  },
];

export const initialAdmins: Admin[] = [
  {
    id: '1',
    name: 'Admin Utama',
    email: 'admin@example.com',
    password: 'admin123',
  }
];

// Combine all users for authentication
export const initialUsers: User[] = [
  ...initialStudents.map(student => ({
    id: `student-${student.id}`,
    email: student.email,
    name: student.name,
    password: student.password || '123456',
    role: 'student' as const,
    roleId: student.id
  })),
  ...initialTeachers.map(teacher => ({
    id: `teacher-${teacher.id}`,
    email: teacher.email,
    name: teacher.name,
    password: teacher.password || '123456',
    role: 'teacher' as const,
    roleId: teacher.id
  })),
  ...initialAdmins.map(admin => ({
    id: `admin-${admin.id}`,
    email: admin.email,
    name: admin.name,
    password: admin.password,
    role: 'admin' as const,
    roleId: admin.id
  }))
];

export const initialSubjects: Subject[] = [
  {
    id: '1',
    name: 'Matematika',
    code: 'MTK12',
    teacherId: '1',
  },
  {
    id: '2',
    name: 'Fisika',
    code: 'FIS12',
    teacherId: '1',
  },
  {
    id: '3',
    name: 'Kimia',
    code: 'KIM12',
    teacherId: '2',
  },
];

export const initialSchedules: Schedule[] = [
  {
    id: '1',
    subjectId: '1',
    teacherId: '1',
    class: 'XII IPA 1',
    dayOfWeek: 'Senin',
    startTime: '08:00',
    endTime: '09:30',
    roomNumber: 'R101',
  },
  {
    id: '2',
    subjectId: '2',
    teacherId: '1',
    class: 'XII IPA 1',
    dayOfWeek: 'Selasa',
    startTime: '10:00',
    endTime: '11:30',
    roomNumber: 'R102',
  },
];

export const initialAttendances: Attendance[] = [
  {
    id: '1',
    studentId: '1',
    scheduleId: '1',
    subjectId: '1',
    date: '2025-05-03',
    status: 'present',
    timestamp: '2025-05-03T08:15:00Z',
  },
  {
    id: '2',
    studentId: '2',
    scheduleId: '1',
    subjectId: '1',
    date: '2025-05-03',
    status: 'present',
    timestamp: '2025-05-03T08:12:00Z',
  },
];
