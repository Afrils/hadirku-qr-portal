
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { toast } from '@/components/ui/sonner';

type Student = {
  id: string;
  name: string;
  studentId: string;
  class: string;
  email: string;
};

type Teacher = {
  id: string;
  name: string;
  teacherId: string;
  email: string;
  subjects: string[];
};

type Subject = {
  id: string;
  name: string;
  code: string;
  teacherId: string;
};

type Schedule = {
  id: string;
  subjectId: string;
  teacherId: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  roomNumber: string;
};

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
};

const AppContext = createContext<AppContextType | undefined>(undefined);

// Sample data
const initialStudents: Student[] = [
  {
    id: '1',
    name: 'Ahmad Farizi',
    studentId: 'S001',
    class: 'XII IPA 1',
    email: 'ahmad.farizi@example.com',
  },
  {
    id: '2',
    name: 'Diah Purnama',
    studentId: 'S002',
    class: 'XII IPA 1',
    email: 'diah.p@example.com',
  },
  {
    id: '3',
    name: 'Budi Santoso',
    studentId: 'S003',
    class: 'XII IPS 2',
    email: 'budi.santoso@example.com',
  },
];

const initialTeachers: Teacher[] = [
  {
    id: '1',
    name: 'Siti Rahayu',
    teacherId: 'T001',
    email: 'siti.rahayu@example.com',
    subjects: ['Matematika', 'Fisika'],
  },
  {
    id: '2',
    name: 'Bambang Wijaya',
    teacherId: 'T002',
    email: 'bambang.w@example.com',
    subjects: ['Kimia'],
  },
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
    dayOfWeek: 'Senin',
    startTime: '08:00',
    endTime: '09:30',
    roomNumber: 'R101',
  },
  {
    id: '2',
    subjectId: '2',
    teacherId: '1',
    dayOfWeek: 'Selasa',
    startTime: '10:00',
    endTime: '11:30',
    roomNumber: 'R102',
  },
];

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [teachers, setTeachers] = useState<Teacher[]>(initialTeachers);
  const [subjects, setSubjects] = useState<Subject[]>(initialSubjects);
  const [schedules, setSchedules] = useState<Schedule[]>(initialSchedules);

  // Student functions
  const addStudent = (student: Omit<Student, 'id'>) => {
    const newStudent = {
      ...student,
      id: `${Date.now()}`,
    };
    setStudents([...students, newStudent]);
    toast.success('Siswa berhasil ditambahkan');
  };

  const updateStudent = (id: string, student: Omit<Student, 'id'>) => {
    setStudents(
      students.map((s) => (s.id === id ? { ...student, id } : s))
    );
    toast.success('Data siswa berhasil diperbarui');
  };

  const deleteStudent = (id: string) => {
    setStudents(students.filter((s) => s.id !== id));
    toast.success('Siswa berhasil dihapus');
  };

  // Teacher functions
  const addTeacher = (teacher: Omit<Teacher, 'id'>) => {
    const newTeacher = {
      ...teacher,
      id: `${Date.now()}`,
    };
    setTeachers([...teachers, newTeacher]);
    toast.success('Guru berhasil ditambahkan');
  };

  const updateTeacher = (id: string, teacher: Omit<Teacher, 'id'>) => {
    setTeachers(
      teachers.map((t) => (t.id === id ? { ...teacher, id } : t))
    );
    toast.success('Data guru berhasil diperbarui');
  };

  const deleteTeacher = (id: string) => {
    setTeachers(teachers.filter((t) => t.id !== id));
    toast.success('Guru berhasil dihapus');
  };

  // Subject functions
  const addSubject = (subject: Omit<Subject, 'id'>) => {
    const newSubject = {
      ...subject,
      id: `${Date.now()}`,
    };
    setSubjects([...subjects, newSubject]);
    toast.success('Mata pelajaran berhasil ditambahkan');
  };

  const updateSubject = (id: string, subject: Omit<Subject, 'id'>) => {
    setSubjects(
      subjects.map((s) => (s.id === id ? { ...subject, id } : s))
    );
    toast.success('Mata pelajaran berhasil diperbarui');
  };

  const deleteSubject = (id: string) => {
    setSubjects(subjects.filter((s) => s.id !== id));
    toast.success('Mata pelajaran berhasil dihapus');
  };

  // Schedule functions
  const addSchedule = (schedule: Omit<Schedule, 'id'>) => {
    const newSchedule = {
      ...schedule,
      id: `${Date.now()}`,
    };
    setSchedules([...schedules, newSchedule]);
    toast.success('Jadwal berhasil ditambahkan');
  };

  const updateSchedule = (id: string, schedule: Omit<Schedule, 'id'>) => {
    setSchedules(
      schedules.map((s) => (s.id === id ? { ...schedule, id } : s))
    );
    toast.success('Jadwal berhasil diperbarui');
  };

  const deleteSchedule = (id: string) => {
    setSchedules(schedules.filter((s) => s.id !== id));
    toast.success('Jadwal berhasil dihapus');
  };

  // Utility functions
  const getTeacherById = (id: string) => {
    return teachers.find((teacher) => teacher.id === id);
  };

  const getSubjectById = (id: string) => {
    return subjects.find((subject) => subject.id === id);
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
