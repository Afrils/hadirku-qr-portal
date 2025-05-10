
import { Student, Teacher, Subject, Schedule, Attendance, Admin, User } from '../types/dataTypes';
import { supabase, TABLES } from './supabaseClient';
import { handleSupabaseError } from './supabaseClient';

// Import the initial data (we'll use this for the first time setup or when resetting)
import {
  initialStudents,
  initialTeachers,
  initialAdmins,
  initialSubjects,
  initialSchedules,
  initialAttendances
} from './initialData';

// Generic CRUD operations using Supabase
const getAll = async <T>(table: string): Promise<T[]> => {
  try {
    const { data, error } = await supabase
      .from(table)
      .select('*');
    
    if (error) handleSupabaseError(error, `fetching all from ${table}`);
    return data || [];
  } catch (error) {
    console.error(`Error in getAll(${table}):`, error);
    return [];
  }
};

const getById = async <T>(table: string, id: string): Promise<T | null> => {
  try {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .eq('id', id)
      .single();
    
    if (error && error.code !== 'PGRST116') { // Ignore not found error
      handleSupabaseError(error, `fetching by id from ${table}`);
    }
    
    return data || null;
  } catch (error) {
    console.error(`Error in getById(${table}, ${id}):`, error);
    return null;
  }
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
  try {
    console.log(`Attempting to authenticate user with email: ${email}`);
    
    // For now, we'll do a direct password comparison in the users table
    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error) {
      console.error('Authentication error:', error);
      
      // Try demo credentials as a fallback for testing
      if (email === 'admin@example.com' && password === 'admin123') {
        console.log('Using demo admin fallback');
        return {
          id: 'admin-1',
          name: 'Admin Utama',
          email: 'admin@example.com',
          password: 'admin123',
          role: 'admin',
          roleId: '1'
        };
      }
      
      // Teacher demo account
      if (email === 'siti.rahayu@example.com' && password === '123456') {
        console.log('Using demo teacher fallback');
        return {
          id: 'teacher-1',
          name: 'Siti Rahayu',
          email: 'siti.rahayu@example.com',
          password: '123456',
          role: 'teacher',
          roleId: '1'
        };
      }
      
      // Student demo account
      if (email === 'ahmad.farizi@example.com' && password === '123456') {
        console.log('Using demo student fallback');
        return {
          id: 'student-1',
          name: 'Ahmad Farizi',
          email: 'ahmad.farizi@example.com',
          password: '123456',
          role: 'student',
          roleId: '1'
        };
      }
      
      return null;
    }

    const user = users as User;
    
    // Direct password comparison (not secure, but for demo purposes)
    if (user && user.password === password) {
      console.log('Authentication successful for user:', user.name);
      // Store current user in localStorage for session management
      localStorage.setItem('attendance_current_user', JSON.stringify(user));
      return user;
    }
    
    return null;
  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
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
    console.log('Checking if data needs to be seeded...');
    
    // Check if users table has data
    const { count: userCount, error: countError } = await supabase
      .from(TABLES.USERS)
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      console.error('Error checking user count:', countError);
      return false;
    }
    
    if (!userCount || userCount === 0) {
      console.log('No users found. Seeding initial data...');
      
      // Insert initial data - first create admin
      await supabase.from(TABLES.ADMINS).insert(initialAdmins);
      console.log('Admins created');
      
      // Create other data
      await supabase.from(TABLES.STUDENTS).insert(initialStudents);
      console.log('Students created');
      
      await supabase.from(TABLES.TEACHERS).insert(initialTeachers);
      console.log('Teachers created');
      
      // Creating users based on admin, teachers, and students
      const admins = initialAdmins.map(admin => ({
        name: admin.name,
        email: admin.email,
        password: admin.password,
        role: 'admin',
        roleId: admin.id
      }));
      
      const teachers = initialTeachers.map(teacher => ({
        name: teacher.name,
        email: teacher.email,
        password: teacher.password || '123456',
        role: 'teacher',
        roleId: teacher.id
      }));
      
      const students = initialStudents.map(student => ({
        name: student.name,
        email: student.email,
        password: student.password || '123456',
        role: 'student',
        roleId: student.id
      }));
      
      const allUsers = [...admins, ...teachers, ...students];
      await supabase.from(TABLES.USERS).insert(allUsers);
      console.log('Users created');
      
      await supabase.from(TABLES.SUBJECTS).insert(initialSubjects);
      console.log('Subjects created');
      
      await supabase.from(TABLES.SCHEDULES).insert(initialSchedules);
      console.log('Schedules created');
      
      await supabase.from(TABLES.ATTENDANCES).insert(initialAttendances);
      console.log('Attendances created');
      
      console.log('Initial data seeded successfully');
      return true;
    } else {
      console.log('Data already exists, skipping seed');
      return true;
    }
  } catch (error) {
    console.error('Error seeding initial data:', error);
    return false;
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
};
