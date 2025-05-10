import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from '@/components/ui/sonner';
import { Student, Teacher, Subject, Schedule, User } from '../types/dataTypes';
import { dbService } from '../services/dbService';
import { handleError } from '@/utils/errorHandler';

type AppContextType = {
  students: Student[];
  teachers: Teacher[];
  subjects: Subject[];
  schedules: Schedule[];
  currentUser: User | null;
  login: (email: string, password: string) => Promise<User | null>;
  logout: () => void;
  isAuthenticated: boolean;
  addStudent: (student: Omit<Student, 'id'>) => void;
  updateStudent: (id: string, student: Omit<Student, 'id'>) => void;
  deleteStudent: (id: string) => void;
  addTeacher: (teacher: Omit<Teacher, 'id'>) => void;
  updateTeacher: (id: string, teacher: Omit<Teacher, 'id'>) => void;
  deleteTeacher: (id: string) => void;
  addSubject: (subject: Omit<Subject, 'id'>) => void;
  updateSubject: (id: string, subject: Omit<Subject, 'id'>) => void;
  deleteSubject: (id: string) => void;
  addSchedule: (schedule: Omit<Schedule, 'id'>) => void;
  updateSchedule: (id: string, schedule: Omit<Schedule, 'id'>) => void;
  deleteSchedule: (id: string) => void;
  getTeacherById: (id: string) => Promise<Teacher | null>;
  getSubjectById: (id: string) => Promise<Subject | null>;
  refreshData: () => void;
  isLoading: boolean;
  hasError: boolean;
  databaseError: string | null;
  retryDatabaseConnection: () => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);
  const [databaseError, setDatabaseError] = useState<string | null>(null);

  // Authentication functions
  const login = async (email: string, password: string): Promise<User | null> => {
    try {
      const user = await dbService.login(email, password);
      if (user) {
        setCurrentUser(user);
        setIsAuthenticated(true);
        toast.success(`Selamat datang, ${user.name}`);
        return user;
      } else {
        toast.error('Login gagal. Email atau password tidak valid.');
        return null;
      }
    } catch (error) {
      console.error('Error during login:', error);
      toast.error('Terjadi kesalahan saat login');
      return null;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    toast.success('Anda telah keluar dari sistem.');
  };

  // Function to initialize the database
  const initializeDatabase = async () => {
    try {
      await dbService.initDatabase();
      console.log("Database initialized successfully");
    } catch (error) {
      console.error("Failed to initialize database:", error);
      setDatabaseError(error instanceof Error ? error.message : "Unknown error initializing database");
    }
  };

  // Load initial data
  const loadData = async () => {
    setIsLoading(true);
    setHasError(false);
    setDatabaseError(null);

    try {
      await initializeDatabase();
      
      const [studentsData, teachersData, subjectsData, schedulesData] = await Promise.all([
        dbService.getAllStudents().catch(err => {
          console.error('Error fetching students:', err);
          return [] as Student[];
        }),
        dbService.getAllTeachers().catch(err => {
          console.error('Error fetching teachers:', err);
          return [] as Teacher[];
        }),
        dbService.getAllSubjects().catch(err => {
          console.error('Error fetching subjects:', err);
          return [] as Subject[];
        }),
        dbService.getAllSchedules().catch(err => {
          console.error('Error fetching schedules:', err);
          return [] as Schedule[];
        })
      ]);

      setStudents(studentsData);
      setTeachers(teachersData);
      setSubjects(subjectsData);
      setSchedules(schedulesData);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading data:', error);
      setHasError(true);
      setDatabaseError(error instanceof Error ? error.message : 'Failed to load data from database');
      setIsLoading(false);
      toast.error('Gagal memuat data');
    }
  };

  // Function to retry database connection
  const retryDatabaseConnection = () => {
    setIsLoading(true);
    setHasError(false);
    setDatabaseError(null);
    loadData();
  };

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, []);

  // Refresh data periodically, but only if we have no errors
  useEffect(() => {
    let interval: number | undefined;
    
    if (!hasError) {
      interval = window.setInterval(() => {
        loadData();
      }, 60000); // Refresh every minute instead of 30 seconds to reduce load
    }
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [hasError]);

  // Function to refresh all data
  const refreshData = () => {
    loadData();
  };

  // Student functions
  const addStudent = async (student: Omit<Student, 'id'>) => {
    try {
      await dbService.createStudent(student);
      const updatedStudents = await dbService.getAllStudents();
      setStudents(updatedStudents);
      toast.success('Siswa berhasil ditambahkan');
    } catch (error) {
      console.error('Error adding student:', error);
      toast.error('Gagal menambahkan siswa');
      throw error;
    }
  };

  const updateStudent = async (id: string, student: Omit<Student, 'id'>) => {
    try {
      await dbService.updateStudent(id, student);
      const updatedStudents = await dbService.getAllStudents();
      setStudents(updatedStudents);
      toast.success('Data siswa berhasil diperbarui');
    } catch (error) {
      console.error('Error updating student:', error);
      toast.error('Gagal memperbarui data siswa');
      throw error;
    }
  };

  const deleteStudent = async (id: string) => {
    try {
      await dbService.deleteStudent(id);
      const updatedStudents = await dbService.getAllStudents();
      setStudents(updatedStudents);
      toast.success('Siswa berhasil dihapus');
    } catch (error) {
      console.error('Error deleting student:', error);
      toast.error('Gagal menghapus siswa');
      throw error;
    }
  };

  // Teacher functions
  const addTeacher = async (teacher: Omit<Teacher, 'id'>) => {
    try {
      await dbService.createTeacher(teacher);
      const updatedTeachers = await dbService.getAllTeachers();
      setTeachers(updatedTeachers);
      toast.success('Guru berhasil ditambahkan');
    } catch (error) {
      console.error('Error adding teacher:', error);
      toast.error('Gagal menambahkan guru');
      throw error;
    }
  };

  const updateTeacher = async (id: string, teacher: Omit<Teacher, 'id'>) => {
    try {
      await dbService.updateTeacher(id, teacher);
      const updatedTeachers = await dbService.getAllTeachers();
      setTeachers(updatedTeachers);
      toast.success('Data guru berhasil diperbarui');
    } catch (error) {
      console.error('Error updating teacher:', error);
      toast.error('Gagal memperbarui data guru');
      throw error;
    }
  };

  const deleteTeacher = async (id: string) => {
    try {
      await dbService.deleteTeacher(id);
      const updatedTeachers = await dbService.getAllTeachers();
      setTeachers(updatedTeachers);
      toast.success('Guru berhasil dihapus');
    } catch (error) {
      console.error('Error deleting teacher:', error);
      toast.error('Gagal menghapus guru');
      throw error;
    }
  };

  // Subject functions
  const addSubject = async (subject: Omit<Subject, 'id'>) => {
    try {
      await dbService.createSubject(subject);
      const updatedSubjects = await dbService.getAllSubjects();
      setSubjects(updatedSubjects);
      toast.success('Mata pelajaran berhasil ditambahkan');
    } catch (error) {
      console.error('Error adding subject:', error);
      toast.error('Gagal menambahkan mata pelajaran');
      throw error;
    }
  };

  const updateSubject = async (id: string, subject: Omit<Subject, 'id'>) => {
    try {
      await dbService.updateSubject(id, subject);
      const updatedSubjects = await dbService.getAllSubjects();
      setSubjects(updatedSubjects);
      toast.success('Mata pelajaran berhasil diperbarui');
    } catch (error) {
      console.error('Error updating subject:', error);
      toast.error('Gagal memperbarui mata pelajaran');
      throw error;
    }
  };

  const deleteSubject = async (id: string) => {
    try {
      await dbService.deleteSubject(id);
      const updatedSubjects = await dbService.getAllSubjects();
      setSubjects(updatedSubjects);
      toast.success('Mata pelajaran berhasil dihapus');
    } catch (error) {
      console.error('Error deleting subject:', error);
      toast.error('Gagal menghapus mata pelajaran');
      throw error;
    }
  };

  // Schedule functions
  const addSchedule = async (schedule: Omit<Schedule, 'id'>) => {
    try {
      await dbService.createSchedule(schedule);
      const updatedSchedules = await dbService.getAllSchedules();
      setSchedules(updatedSchedules);
      toast.success('Jadwal berhasil ditambahkan');
    } catch (error) {
      console.error('Error adding schedule:', error);
      toast.error('Gagal menambahkan jadwal');
      throw error;
    }
  };

  const updateSchedule = async (id: string, schedule: Omit<Schedule, 'id'>) => {
    try {
      await dbService.updateSchedule(id, schedule);
      const updatedSchedules = await dbService.getAllSchedules();
      setSchedules(updatedSchedules);
      toast.success('Jadwal berhasil diperbarui');
    } catch (error) {
      console.error('Error updating schedule:', error);
      toast.error('Gagal memperbarui jadwal');
      throw error;
    }
  };

  const deleteSchedule = async (id: string) => {
    try {
      await dbService.deleteSchedule(id);
      const updatedSchedules = await dbService.getAllSchedules();
      setSchedules(updatedSchedules);
      toast.success('Jadwal berhasil dihapus');
    } catch (error) {
      console.error('Error deleting schedule:', error);
      toast.error('Gagal menghapus jadwal');
      throw error;
    }
  };

  // Utility functions
  const getTeacherById = async (id: string) => {
    return await dbService.getTeacherById(id);
  };

  const getSubjectById = async (id: string) => {
    return await dbService.getSubjectById(id);
  };

  return (
    <AppContext.Provider
      value={{
        students,
        teachers,
        subjects,
        schedules,
        currentUser,
        login,
        logout,
        isAuthenticated,
        addStudent,
        updateStudent,
        deleteStudent,
        addTeacher,
        updateTeacher,
        deleteTeacher,
        addSubject,
        updateSubject,
        deleteSubject,
        addSchedule,
        updateSchedule,
        deleteSchedule,
        getTeacherById,
        getSubjectById,
        refreshData,
        isLoading,
        hasError,
        databaseError,
        retryDatabaseConnection
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
