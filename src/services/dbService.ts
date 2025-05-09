
import { Student, Teacher, Subject, Schedule, Attendance, Admin, User } from '../types/dataTypes';
import { supabase, TABLES, handleSupabaseError } from './supabaseClient';

// Import the initial data (we'll use this for the first time setup or when resetting)
import {
  initialStudents,
  initialTeachers,
  initialAdmins,
  initialUsers,
  initialSubjects,
  initialSchedules,
  initialAttendances
} from './initialData';

// Generic CRUD operations using Supabase
const getAll = async <T>(table: string): Promise<T[]> => {
  const { data, error } = await supabase
    .from(table)
    .select('*');
  
  if (error) handleSupabaseError(error, `fetching all from ${table}`);
  return data || [];
};

const getById = async <T>(table: string, id: string): Promise<T | null> => {
  const { data, error } = await supabase
    .from(table)
    .select('*')
    .eq('id', id)
    .single();
  
  if (error && error.code !== 'PGRST116') { // Ignore not found error
    handleSupabaseError(error, `fetching by id from ${table}`);
  }
  
  return data || null;
};

const create = async <T extends { id?: string }>(table: string, item: Omit<T, 'id'>): Promise<T> => {
  const { data, error } = await supabase
    .from(table)
    .insert([item])
    .select()
    .single();
  
  if (error) handleSupabaseError(error, `creating in ${table}`);
  return data as T;
};

const update = async <T extends { id: string }>(table: string, id: string, item: Omit<T, 'id'>): Promise<T> => {
  const { data, error } = await supabase
    .from(table)
    .update(item)
    .eq('id', id)
    .select()
    .single();
  
  if (error) handleSupabaseError(error, `updating in ${table}`);
  return data as T;
};

const remove = async (table: string, id: string): Promise<void> => {
  const { error } = await supabase
    .from(table)
    .delete()
    .eq('id', id);
  
  if (error) handleSupabaseError(error, `deleting from ${table}`);
};

// Authentication functions
const authenticateUser = async (email: string, password: string): Promise<User | null> => {
  // First try to find the user by email
  const { data: users, error: userError } = await supabase
    .from(TABLES.USERS)
    .select('*')
    .eq('email', email)
    .single();
  
  if (userError && userError.code !== 'PGRST116') {
    handleSupabaseError(userError, 'authentication');
    return null;
  }
  
  if (!users) return null;
  
  // Now verify password based on role
  let isValid = false;
  const user = users as User;
  
  if (user.role === 'student') {
    const student = await getById<Student>(TABLES.STUDENTS, user.roleId || '');
    isValid = student?.password === password;
  } else if (user.role === 'teacher') {
    const teacher = await getById<Teacher>(TABLES.TEACHERS, user.roleId || '');
    isValid = teacher?.password === password;
  } else if (user.role === 'admin') {
    const admin = await getById<Admin>(TABLES.ADMINS, user.roleId || '');
    isValid = admin?.password === password;
  }
  
  if (isValid) {
    // Store current user in localStorage for session management
    localStorage.setItem('attendance_current_user', JSON.stringify(user));
    return user;
  }
  
  return null;
};

const getCurrentUser = (): User | null => {
  const userJson = localStorage.getItem('attendance_current_user');
  return userJson ? JSON.parse(userJson) : null;
};

const logoutUser = (): void => {
  localStorage.removeItem('attendance_current_user');
};

// Function to seed initial data
const seedInitialData = async () => {
  try {
    // Check if students table has data
    const { count: studentCount } = await supabase
      .from(TABLES.STUDENTS)
      .select('*', { count: 'exact', head: true });
    
    if (!studentCount || studentCount === 0) {
      // Insert initial data
      await supabase.from(TABLES.STUDENTS).insert(initialStudents);
      await supabase.from(TABLES.TEACHERS).insert(initialTeachers);
      await supabase.from(TABLES.ADMINS).insert(initialAdmins);
      await supabase.from(TABLES.USERS).insert(initialUsers);
      await supabase.from(TABLES.SUBJECTS).insert(initialSubjects);
      await supabase.from(TABLES.SCHEDULES).insert(initialSchedules);
      await supabase.from(TABLES.ATTENDANCES).insert(initialAttendances);
      
      console.log('Initial data seeded successfully');
    }
  } catch (error) {
    console.error('Error seeding initial data:', error);
  }
};

// Export the database service
export const dbService = {
  // Initialization
  initDatabase: seedInitialData,
  
  // Student operations
  getAllStudents: () => getAll<Student>(TABLES.STUDENTS),
  getStudentById: (id: string) => getById<Student>(TABLES.STUDENTS, id),
  createStudent: (student: Omit<Student, 'id'>) => create<Student>(TABLES.STUDENTS, student),
  updateStudent: (id: string, student: Omit<Student, 'id'>) => update<Student>(TABLES.STUDENTS, id, student),
  deleteStudent: (id: string) => remove(TABLES.STUDENTS, id),
  
  // Teacher operations
  getAllTeachers: () => getAll<Teacher>(TABLES.TEACHERS),
  getTeacherById: (id: string) => getById<Teacher>(TABLES.TEACHERS, id),
  createTeacher: (teacher: Omit<Teacher, 'id'>) => create<Teacher>(TABLES.TEACHERS, teacher),
  updateTeacher: (id: string, teacher: Omit<Teacher, 'id'>) => update<Teacher>(TABLES.TEACHERS, id, teacher),
  deleteTeacher: (id: string) => remove(TABLES.TEACHERS, id),
  
  // Admin operations
  getAllAdmins: () => getAll<Admin>(TABLES.ADMINS),
  getAdminById: (id: string) => getById<Admin>(TABLES.ADMINS, id),
  createAdmin: (admin: Omit<Admin, 'id'>) => create<Admin>(TABLES.ADMINS, admin),
  updateAdmin: (id: string, admin: Omit<Admin, 'id'>) => update<Admin>(TABLES.ADMINS, id, admin),
  deleteAdmin: (id: string) => remove(TABLES.ADMINS, id),
  
  // User operations
  getAllUsers: () => getAll<User>(TABLES.USERS),
  getUserById: (id: string) => getById<User>(TABLES.USERS, id),
  createUser: (user: Omit<User, 'id'>) => create<User>(TABLES.USERS, user),
  updateUser: (id: string, user: Omit<User, 'id'>) => update<User>(TABLES.USERS, id, user),
  deleteUser: (id: string) => remove(TABLES.USERS, id),
  
  // Authentication
  login: authenticateUser,
  logout: logoutUser,
  getCurrentUser,
  
  // Subject operations
  getAllSubjects: () => getAll<Subject>(TABLES.SUBJECTS),
  getSubjectById: (id: string) => getById<Subject>(TABLES.SUBJECTS, id),
  createSubject: (subject: Omit<Subject, 'id'>) => create<Subject>(TABLES.SUBJECTS, subject),
  updateSubject: (id: string, subject: Omit<Subject, 'id'>) => update<Subject>(TABLES.SUBJECTS, id, subject),
  deleteSubject: (id: string) => remove(TABLES.SUBJECTS, id),
  
  // Schedule operations
  getAllSchedules: () => getAll<Schedule>(TABLES.SCHEDULES),
  getScheduleById: (id: string) => getById<Schedule>(TABLES.SCHEDULES, id),
  createSchedule: (schedule: Omit<Schedule, 'id'>) => create<Schedule>(TABLES.SCHEDULES, schedule),
  updateSchedule: (id: string, schedule: Omit<Schedule, 'id'>) => update<Schedule>(TABLES.SCHEDULES, id, schedule),
  deleteSchedule: (id: string) => remove(TABLES.SCHEDULES, id),
  
  // Attendance operations
  getAllAttendances: () => getAll<Attendance>(TABLES.ATTENDANCES),
  getAttendanceById: (id: string) => getById<Attendance>(TABLES.ATTENDANCES, id),
  createAttendance: (attendance: Omit<Attendance, 'id'>) => create<Attendance>(TABLES.ATTENDANCES, attendance),
  updateAttendance: (id: string, attendance: Omit<Attendance, 'id'>) => update<Attendance>(TABLES.ATTENDANCES, id, attendance),
  deleteAttendance: (id: string) => remove(TABLES.ATTENDANCES, id),
  
  // Helper methods for attendance
  getAttendancesBySchedule: async (scheduleId: string) => {
    const { data, error } = await supabase
      .from(TABLES.ATTENDANCES)
      .select('*')
      .eq('scheduleId', scheduleId);
      
    if (error) handleSupabaseError(error, 'fetching attendances by schedule');
    return data || [];
  },
  
  getAttendancesByStudent: async (studentId: string) => {
    const { data, error } = await supabase
      .from(TABLES.ATTENDANCES)
      .select('*')
      .eq('studentId', studentId);
      
    if (error) handleSupabaseError(error, 'fetching attendances by student');
    return data || [];
  },
  
  getAttendancesByDate: async (date: string) => {
    const { data, error } = await supabase
      .from(TABLES.ATTENDANCES)
      .select('*')
      .eq('date', date);
      
    if (error) handleSupabaseError(error, 'fetching attendances by date');
    return data || [];
  },
  
  // Report generation and export
  getAttendanceReport: async (startDate: string, endDate: string, subjectId?: string, studentId?: string) => {
    let query = supabase
      .from(TABLES.ATTENDANCES)
      .select('*')
      .gte('date', startDate)
      .lte('date', endDate);
    
    if (subjectId) {
      query = query.eq('subjectId', subjectId);
    }
    
    if (studentId) {
      query = query.eq('studentId', studentId);
    }
    
    const { data, error } = await query;
    
    if (error) handleSupabaseError(error, 'generating attendance report');
    return data || [];
  },
  
  // Reset data (for testing)
  resetData: async () => {
    try {
      await supabase.from(TABLES.ATTENDANCES).delete().neq('id', '0');
      await supabase.from(TABLES.SCHEDULES).delete().neq('id', '0');
      await supabase.from(TABLES.SUBJECTS).delete().neq('id', '0');
      await supabase.from(TABLES.USERS).delete().neq('id', '0');
      await supabase.from(TABLES.ADMINS).delete().neq('id', '0');
      await supabase.from(TABLES.TEACHERS).delete().neq('id', '0');
      await supabase.from(TABLES.STUDENTS).delete().neq('id', '0');
      
      await seedInitialData();
    } catch (error) {
      console.error('Error resetting data:', error);
    }
  },
};
