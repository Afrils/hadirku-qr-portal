
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from '@/components/ui/sonner';
import { Student, Teacher, Subject, Schedule } from '../types/dataTypes';
import { dbService } from '../services/dbService';

type AppContextType = {
  students: Student[];
  teachers: Teacher[];
  subjects: Subject[];
  schedules: Schedule[];
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
  getTeacherById: (id: string) => Teacher | undefined;
  getSubjectById: (id: string) => Subject | undefined;
  refreshData: () => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);

  // Load initial data
  const loadData = () => {
    setStudents(dbService.getAllStudents());
    setTeachers(dbService.getAllTeachers());
    setSubjects(dbService.getAllSubjects());
    setSchedules(dbService.getAllSchedules());
  };

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, []);

  // Function to refresh all data
  const refreshData = () => {
    loadData();
  };

  // Student functions
  const addStudent = (student: Omit<Student, 'id'>) => {
    dbService.createStudent(student);
    setStudents(dbService.getAllStudents());
    toast.success('Siswa berhasil ditambahkan');
  };

  const updateStudent = (id: string, student: Omit<Student, 'id'>) => {
    dbService.updateStudent(id, student);
    setStudents(dbService.getAllStudents());
    toast.success('Data siswa berhasil diperbarui');
  };

  const deleteStudent = (id: string) => {
    dbService.deleteStudent(id);
    setStudents(dbService.getAllStudents());
    toast.success('Siswa berhasil dihapus');
  };

  // Teacher functions
  const addTeacher = (teacher: Omit<Teacher, 'id'>) => {
    dbService.createTeacher(teacher);
    setTeachers(dbService.getAllTeachers());
    toast.success('Guru berhasil ditambahkan');
  };

  const updateTeacher = (id: string, teacher: Omit<Teacher, 'id'>) => {
    dbService.updateTeacher(id, teacher);
    setTeachers(dbService.getAllTeachers());
    toast.success('Data guru berhasil diperbarui');
  };

  const deleteTeacher = (id: string) => {
    dbService.deleteTeacher(id);
    setTeachers(dbService.getAllTeachers());
    toast.success('Guru berhasil dihapus');
  };

  // Subject functions
  const addSubject = (subject: Omit<Subject, 'id'>) => {
    dbService.createSubject(subject);
    setSubjects(dbService.getAllSubjects());
    toast.success('Mata pelajaran berhasil ditambahkan');
  };

  const updateSubject = (id: string, subject: Omit<Subject, 'id'>) => {
    dbService.updateSubject(id, subject);
    setSubjects(dbService.getAllSubjects());
    toast.success('Mata pelajaran berhasil diperbarui');
  };

  const deleteSubject = (id: string) => {
    dbService.deleteSubject(id);
    setSubjects(dbService.getAllSubjects());
    toast.success('Mata pelajaran berhasil dihapus');
  };

  // Schedule functions
  const addSchedule = (schedule: Omit<Schedule, 'id'>) => {
    dbService.createSchedule(schedule);
    setSchedules(dbService.getAllSchedules());
    toast.success('Jadwal berhasil ditambahkan');
  };

  const updateSchedule = (id: string, schedule: Omit<Schedule, 'id'>) => {
    dbService.updateSchedule(id, schedule);
    setSchedules(dbService.getAllSchedules());
    toast.success('Jadwal berhasil diperbarui');
  };

  const deleteSchedule = (id: string) => {
    dbService.deleteSchedule(id);
    setSchedules(dbService.getAllSchedules());
    toast.success('Jadwal berhasil dihapus');
  };

  // Utility functions
  const getTeacherById = (id: string) => {
    return dbService.getTeacherById(id);
  };

  const getSubjectById = (id: string) => {
    return dbService.getSubjectById(id);
  };

  return (
    <AppContext.Provider
      value={{
        students,
        teachers,
        subjects,
        schedules,
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
