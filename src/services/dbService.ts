
import { Student, Teacher, Subject, Schedule, Attendance, Admin, User } from '../types/dataTypes';

// Mock data for initial state
const initialStudents: Student[] = [
  {
    id: '1',
    name: 'Ahmad Farizi',
    studentId: 'S001',
    class: 'XII IPA 1',
    email: 'ahmad.farizi@example.com',
    password: '123456',
  },
  {
    id: '2',
    name: 'Diah Purnama',
    studentId: 'S002',
    class: 'XII IPA 1',
    email: 'diah.p@example.com',
    password: '123456',
  },
  {
    id: '3',
    name: 'Budi Santoso',
    studentId: 'S003',
    class: 'XII IPS 2',
    email: 'budi.santoso@example.com',
    password: '123456',
  },
];

const initialTeachers: Teacher[] = [
  {
    id: '1',
    name: 'Siti Rahayu',
    teacherId: 'T001',
    email: 'siti.rahayu@example.com',
    subjects: ['Matematika', 'Fisika'],
    password: '123456',
  },
  {
    id: '2',
    name: 'Bambang Wijaya',
    teacherId: 'T002',
    email: 'bambang.w@example.com',
    subjects: ['Kimia'],
    password: '123456',
  },
];

const initialAdmins: Admin[] = [
  {
    id: '1',
    name: 'Admin Utama',
    email: 'admin@example.com',
    password: 'admin123',
  }
];

// Combine all users for authentication
const initialUsers: User[] = [
  ...initialStudents.map(student => ({
    id: `student-${student.id}`,
    email: student.email,
    name: student.name,
    password: student.password || '',
    role: 'student' as const,
    roleId: student.id
  })),
  ...initialTeachers.map(teacher => ({
    id: `teacher-${teacher.id}`,
    email: teacher.email,
    name: teacher.name,
    password: teacher.password || '',
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

const initialSubjects: Subject[] = [
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

const initialSchedules: Schedule[] = [
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

const initialAttendances: Attendance[] = [
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

// Local storage keys
const STORAGE_KEYS = {
  STUDENTS: 'attendance_students',
  TEACHERS: 'attendance_teachers',
  ADMINS: 'attendance_admins',
  USERS: 'attendance_users',
  SUBJECTS: 'attendance_subjects',
  SCHEDULES: 'attendance_schedules',
  ATTENDANCES: 'attendance_records',
  CURRENT_USER: 'attendance_current_user',
};

// Helper functions to interact with localStorage
const getItem = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error getting item from localStorage: ${key}`, error);
    return defaultValue;
  }
};

const setItem = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error setting item in localStorage: ${key}`, error);
  }
};

// Initialize data in localStorage if it doesn't exist
const initializeStorage = () => {
  if (!localStorage.getItem(STORAGE_KEYS.STUDENTS)) {
    setItem(STORAGE_KEYS.STUDENTS, initialStudents);
  }
  if (!localStorage.getItem(STORAGE_KEYS.TEACHERS)) {
    setItem(STORAGE_KEYS.TEACHERS, initialTeachers);
  }
  if (!localStorage.getItem(STORAGE_KEYS.ADMINS)) {
    setItem(STORAGE_KEYS.ADMINS, initialAdmins);
  }
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    setItem(STORAGE_KEYS.USERS, initialUsers);
  }
  if (!localStorage.getItem(STORAGE_KEYS.SUBJECTS)) {
    setItem(STORAGE_KEYS.SUBJECTS, initialSubjects);
  }
  if (!localStorage.getItem(STORAGE_KEYS.SCHEDULES)) {
    setItem(STORAGE_KEYS.SCHEDULES, initialSchedules);
  }
  if (!localStorage.getItem(STORAGE_KEYS.ATTENDANCES)) {
    setItem(STORAGE_KEYS.ATTENDANCES, initialAttendances);
  }
};

// Initialize on module load
initializeStorage();

// Generic CRUD operations
const getAll = <T>(storageKey: string): T[] => {
  return getItem<T[]>(storageKey, []);
};

const getById = <T extends { id: string }>(storageKey: string, id: string): T | undefined => {
  const items = getItem<T[]>(storageKey, []);
  return items.find(item => item.id === id);
};

const create = <T extends { id?: string }>(storageKey: string, item: Omit<T, 'id'>): T => {
  const items = getItem<T[]>(storageKey, []);
  const newItem = { 
    ...item, 
    id: `${Date.now()}` 
  } as T;
  
  setItem(storageKey, [...items, newItem]);
  return newItem;
};

const update = <T extends { id: string }>(storageKey: string, id: string, item: Omit<T, 'id'>): T => {
  const items = getItem<T[]>(storageKey, []);
  const updatedItems = items.map(existingItem => 
    existingItem.id === id ? { ...item, id } as T : existingItem
  );
  
  setItem(storageKey, updatedItems);
  return { ...item, id } as T;
};

const remove = (storageKey: string, id: string): void => {
  const items = getItem<Array<{ id: string }>>(storageKey, []);
  const filteredItems = items.filter(item => item.id !== id);
  setItem(storageKey, filteredItems);
};

// Authentication functions
const authenticateUser = (email: string, password: string): User | null => {
  const users = getAll<User>(STORAGE_KEYS.USERS);
  const user = users.find(u => u.email === email);
  
  if (!user) return null;
  
  // Check password based on role
  let isValid = false;
  if (user.role === 'student') {
    const student = getById<Student>(STORAGE_KEYS.STUDENTS, user.roleId || '');
    isValid = student?.password === password;
  } else if (user.role === 'teacher') {
    const teacher = getById<Teacher>(STORAGE_KEYS.TEACHERS, user.roleId || '');
    isValid = teacher?.password === password;
  } else if (user.role === 'admin') {
    const admin = getById<Admin>(STORAGE_KEYS.ADMINS, user.roleId || '');
    isValid = admin?.password === password;
  }
  
  if (isValid) {
    // Store current user in localStorage
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    return user;
  }
  
  return null;
};

const getCurrentUser = (): User | null => {
  const userJson = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  return userJson ? JSON.parse(userJson) : null;
};

const logoutUser = (): void => {
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
};

// Specific data access methods
export const dbService = {
  // Student operations
  getAllStudents: () => getAll<Student>(STORAGE_KEYS.STUDENTS),
  getStudentById: (id: string) => getById<Student>(STORAGE_KEYS.STUDENTS, id),
  createStudent: (student: Omit<Student, 'id'>) => create<Student>(STORAGE_KEYS.STUDENTS, student),
  updateStudent: (id: string, student: Omit<Student, 'id'>) => update<Student>(STORAGE_KEYS.STUDENTS, id, student),
  deleteStudent: (id: string) => remove(STORAGE_KEYS.STUDENTS, id),
  
  // Teacher operations
  getAllTeachers: () => getAll<Teacher>(STORAGE_KEYS.TEACHERS),
  getTeacherById: (id: string) => getById<Teacher>(STORAGE_KEYS.TEACHERS, id),
  createTeacher: (teacher: Omit<Teacher, 'id'>) => create<Teacher>(STORAGE_KEYS.TEACHERS, teacher),
  updateTeacher: (id: string, teacher: Omit<Teacher, 'id'>) => update<Teacher>(STORAGE_KEYS.TEACHERS, id, teacher),
  deleteTeacher: (id: string) => remove(STORAGE_KEYS.TEACHERS, id),
  
  // Admin operations
  getAllAdmins: () => getAll<Admin>(STORAGE_KEYS.ADMINS),
  getAdminById: (id: string) => getById<Admin>(STORAGE_KEYS.ADMINS, id),
  createAdmin: (admin: Omit<Admin, 'id'>) => create<Admin>(STORAGE_KEYS.ADMINS, admin),
  updateAdmin: (id: string, admin: Omit<Admin, 'id'>) => update<Admin>(STORAGE_KEYS.ADMINS, id, admin),
  deleteAdmin: (id: string) => remove(STORAGE_KEYS.ADMINS, id),
  
  // User operations
  getAllUsers: () => getAll<User>(STORAGE_KEYS.USERS),
  getUserById: (id: string) => getById<User>(STORAGE_KEYS.USERS, id),
  createUser: (user: Omit<User, 'id'>) => create<User>(STORAGE_KEYS.USERS, user),
  updateUser: (id: string, user: Omit<User, 'id'>) => update<User>(STORAGE_KEYS.USERS, id, user),
  deleteUser: (id: string) => remove(STORAGE_KEYS.USERS, id),
  
  // Authentication
  login: authenticateUser,
  logout: logoutUser,
  getCurrentUser,
  
  // Subject operations
  getAllSubjects: () => getAll<Subject>(STORAGE_KEYS.SUBJECTS),
  getSubjectById: (id: string) => getById<Subject>(STORAGE_KEYS.SUBJECTS, id),
  createSubject: (subject: Omit<Subject, 'id'>) => create<Subject>(STORAGE_KEYS.SUBJECTS, subject),
  updateSubject: (id: string, subject: Omit<Subject, 'id'>) => update<Subject>(STORAGE_KEYS.SUBJECTS, id, subject),
  deleteSubject: (id: string) => remove(STORAGE_KEYS.SUBJECTS, id),
  
  // Schedule operations
  getAllSchedules: () => getAll<Schedule>(STORAGE_KEYS.SCHEDULES),
  getScheduleById: (id: string) => getById<Schedule>(STORAGE_KEYS.SCHEDULES, id),
  createSchedule: (schedule: Omit<Schedule, 'id'>) => create<Schedule>(STORAGE_KEYS.SCHEDULES, schedule),
  updateSchedule: (id: string, schedule: Omit<Schedule, 'id'>) => update<Schedule>(STORAGE_KEYS.SCHEDULES, id, schedule),
  deleteSchedule: (id: string) => remove(STORAGE_KEYS.SCHEDULES, id),
  
  // Attendance operations
  getAllAttendances: () => getAll<Attendance>(STORAGE_KEYS.ATTENDANCES),
  getAttendanceById: (id: string) => getById<Attendance>(STORAGE_KEYS.ATTENDANCES, id),
  createAttendance: (attendance: Omit<Attendance, 'id'>) => create<Attendance>(STORAGE_KEYS.ATTENDANCES, attendance),
  updateAttendance: (id: string, attendance: Omit<Attendance, 'id'>) => update<Attendance>(STORAGE_KEYS.ATTENDANCES, id, attendance),
  deleteAttendance: (id: string) => remove(STORAGE_KEYS.ATTENDANCES, id),
  
  // Helper methods for attendance
  getAttendancesBySchedule: (scheduleId: string) => {
    const attendances = getAll<Attendance>(STORAGE_KEYS.ATTENDANCES);
    return attendances.filter(a => a.scheduleId === scheduleId);
  },
  
  getAttendancesByStudent: (studentId: string) => {
    const attendances = getAll<Attendance>(STORAGE_KEYS.ATTENDANCES);
    return attendances.filter(a => a.studentId === studentId);
  },
  
  getAttendancesByDate: (date: string) => {
    const attendances = getAll<Attendance>(STORAGE_KEYS.ATTENDANCES);
    return attendances.filter(a => a.date === date);
  },
  
  // Report generation and export
  getAttendanceReport: (startDate: string, endDate: string, subjectId?: string, studentId?: string) => {
    const attendances = getAll<Attendance>(STORAGE_KEYS.ATTENDANCES);
    let filteredAttendances = attendances.filter(a => {
      const date = a.date;
      return date >= startDate && date <= endDate;
    });
    
    if (subjectId) {
      filteredAttendances = filteredAttendances.filter(a => a.subjectId === subjectId);
    }
    
    if (studentId) {
      filteredAttendances = filteredAttendances.filter(a => a.studentId === studentId);
    }
    
    return filteredAttendances;
  },
  
  // Reset data (for testing)
  resetData: () => {
    setItem(STORAGE_KEYS.STUDENTS, initialStudents);
    setItem(STORAGE_KEYS.TEACHERS, initialTeachers);
    setItem(STORAGE_KEYS.ADMINS, initialAdmins);
    setItem(STORAGE_KEYS.USERS, initialUsers);
    setItem(STORAGE_KEYS.SUBJECTS, initialSubjects);
    setItem(STORAGE_KEYS.SCHEDULES, initialSchedules);
    setItem(STORAGE_KEYS.ATTENDANCES, initialAttendances);
  },
};
