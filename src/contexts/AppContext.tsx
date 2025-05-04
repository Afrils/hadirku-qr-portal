import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from '@/components/ui/sonner';
import { Student, Teacher, Subject, Schedule, User } from '../types/dataTypes';
import { mysqlService } from '../services/mysqlService';

type AppContextType = {
  students: Student[];
  teachers: Teacher[];
  subjects: Subject[];
  schedules: Schedule[];
  currentUser: User | null;
  login: (email: string, password: string) => Promise<boolean>;
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
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Authentication functions
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const user = await mysqlService.login(email, password);
      if (user) {
        setCurrentUser(user);
        setIsAuthenticated(true);
        toast.success(`Selamat datang, ${user.name}`);
        return true;
      } else {
        toast.error('Login gagal. Email atau password tidak valid.');
        return false;
      }
    } catch (error) {
      console.error('Error during login:', error);
      toast.error('Terjadi kesalahan saat login');
      return false;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    toast.success('Anda telah keluar dari sistem.');
  };

  // Load initial data
  const loadData = async () => {
    try {
      const [studentsData, teachersData, subjectsData, schedulesData] = await Promise.all([
        mysqlService.getAllStudents(),
        mysqlService.getAllTeachers(),
        mysqlService.getAllSubjects(),
        mysqlService.getAllSchedules()
      ]);

      setStudents(studentsData);
      setTeachers(teachersData);
      setSubjects(subjectsData);
      setSchedules(schedulesData);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Gagal memuat data');
    }
  };

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, []);

  // Refresh data periodically
  useEffect(() => {
    const interval = setInterval(loadData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  // Function to refresh all data
  const refreshData = () => {
    loadData();
  };

  // Student functions
  const addStudent = async (student: Omit<Student, 'id'>) => {
    try {
      await mysqlService.createStudent(student);
      const updatedStudents = await mysqlService.getAllStudents();
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
      await mysqlService.updateStudent(id, student);
      const updatedStudents = await mysqlService.getAllStudents();
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
      await mysqlService.deleteStudent(id);
      const updatedStudents = await mysqlService.getAllStudents();
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
      await mysqlService.createTeacher(teacher);
      const updatedTeachers = await mysqlService.getAllTeachers();
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
      await mysqlService.updateTeacher(id, teacher);
      const updatedTeachers = await mysqlService.getAllTeachers();
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
      await mysqlService.deleteTeacher(id);
      const updatedTeachers = await mysqlService.getAllTeachers();
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
      await mysqlService.createSubject(subject);
      const updatedSubjects = await mysqlService.getAllSubjects();
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
      await mysqlService.updateSubject(id, subject);
      const updatedSubjects = await mysqlService.getAllSubjects();
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
      await mysqlService.deleteSubject(id);
      const updatedSubjects = await mysqlService.getAllSubjects();
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
      await mysqlService.createSchedule(schedule);
      const updatedSchedules = await mysqlService.getAllSchedules();
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
      await mysqlService.updateSchedule(id, schedule);
      const updatedSchedules = await mysqlService.getAllSchedules();
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
      await mysqlService.deleteSchedule(id);
      const updatedSchedules = await mysqlService.getAllSchedules();
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
    return await mysqlService.getTeacherById(id);
  };

  const getSubjectById = async (id: string) => {
    return await mysqlService.getSubjectById(id);
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
