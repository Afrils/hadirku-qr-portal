
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/components/ui/sonner';
import { dbService } from '@/services/dbService';
import { Student, Teacher, Subject, Schedule, User, Attendance } from '@/types/dataTypes';

// Define what data/functions the context will expose
interface AppContextType {
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
  addAttendance: (attendance: Omit<Attendance, 'id'>) => void;
  isLoading: boolean;
  hasError: boolean;
  databaseError: string | null;
  retryDatabaseConnection: () => void;
  resetSession: () => void;
  lastActivityTime: number;
  updateLastActivityTime: () => void;
  refreshData: () => Promise<void>;
  getTeacherById: (id: string) => Promise<Teacher | null>;
  getSubjectById: (id: string) => Promise<Subject | null>;
}

// Create the context with a default value
const AppContext = createContext<AppContextType | undefined>(undefined);

// Custom hook for using this context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

// Session timeout in milliseconds (3 minutes)
const SESSION_TIMEOUT = 3 * 60 * 1000;

// Provider component that wraps app and makes context available
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);
  const [databaseError, setDatabaseError] = useState<string | null>(null);
  const [lastActivityTime, setLastActivityTime] = useState<number>(Date.now());

  // Session timeout handling
  useEffect(() => {
    const checkSessionTimeout = () => {
      const currentTime = Date.now();
      if (isAuthenticated && currentTime - lastActivityTime > SESSION_TIMEOUT) {
        toast.info("Sesi Anda telah habis karena tidak ada aktivitas");
        logout();
      }
    };

    const intervalId = setInterval(checkSessionTimeout, 60000); // Check every minute
    
    return () => clearInterval(intervalId);
  }, [isAuthenticated, lastActivityTime]);

  // Update last activity time when user interacts with the app
  const updateLastActivityTime = () => {
    setLastActivityTime(Date.now());
  };

  // User activity listeners
  useEffect(() => {
    if (isAuthenticated) {
      const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
      
      const handleUserActivity = () => {
        updateLastActivityTime();
      };
      
      events.forEach(event => {
        window.addEventListener(event, handleUserActivity);
      });
      
      return () => {
        events.forEach(event => {
          window.removeEventListener(event, handleUserActivity);
        });
      };
    }
  }, [isAuthenticated]);

  // Check for saved session on initial load
  useEffect(() => {
    const checkSavedSession = async () => {
      try {
        setIsLoading(true);
        
        // Try to get saved user from localStorage
        const savedUserString = localStorage.getItem('attendance_current_user');
        if (savedUserString) {
          const savedUser = JSON.parse(savedUserString);
          setCurrentUser(savedUser);
          setIsAuthenticated(true);
          updateLastActivityTime();
        }
        
        // Load initial data
        await loadInitialData();
      } catch (error) {
        console.error('Error checking saved session:', error);
        setHasError(true);
        setDatabaseError('Failed to load saved session data');
      } finally {
        setIsLoading(false);
      }
    };
    
    checkSavedSession();
  }, []);

  // Authentication functions
  const login = async (email: string, password: string): Promise<User | null> => {
    try {
      const user = await dbService.login(email, password);
      if (user) {
        setCurrentUser(user);
        setIsAuthenticated(true);
        updateLastActivityTime();
        
        // Save user to localStorage
        localStorage.setItem('attendance_current_user', JSON.stringify(user));
        
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
    dbService.logout(); // Call dbService logout method
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  // Function to reset the session timeout
  const resetSession = () => {
    updateLastActivityTime();
  };

  // Load initial data function
  const loadInitialData = async () => {
    try {
      setIsLoading(true);
      const [studentsData, teachersData, subjectsData, schedulesData] = await Promise.all([
        dbService.getAllStudents(),
        dbService.getAllTeachers(),
        dbService.getAllSubjects(),
        dbService.getAllSchedules(),
      ]);

      setStudents(studentsData);
      setTeachers(teachersData);
      setSubjects(subjectsData);
      setSchedules(schedulesData);
      setHasError(false);
      setDatabaseError(null);
    } catch (error) {
      console.error('Failed to load initial data:', error);
      setHasError(true);
      setDatabaseError('Failed to connect to the database');
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh data function
  const refreshData = async () => {
    await loadInitialData();
    toast.success("Data berhasil diperbarui");
  };

  // Function to retry database connection
  const retryDatabaseConnection = async () => {
    try {
      await loadInitialData();
      toast.success('Berhasil terhubung ke database');
    } catch (error) {
      console.error('Retry failed:', error);
      toast.error('Gagal menghubungkan ke database');
    }
  };

  // Get entity by ID functions
  const getTeacherById = async (id: string): Promise<Teacher | null> => {
    return await dbService.getTeacherById(id);
  };

  const getSubjectById = async (id: string): Promise<Subject | null> => {
    return await dbService.getSubjectById(id);
  };

  // Student CRUD functions
  const addStudent = async (student: Omit<Student, 'id'>) => {
    try {
      setIsLoading(true);
      const newStudent = await dbService.createStudent(student);
      setStudents(prevStudents => [...prevStudents, newStudent]);
      toast.success('Siswa berhasil ditambahkan');
    } catch (error) {
      console.error('Failed to add student:', error);
      toast.error('Gagal menambahkan siswa');
    } finally {
      setIsLoading(false);
    }
  };

  const updateStudent = async (id: string, student: Omit<Student, 'id'>) => {
    try {
      setIsLoading(true);
      await dbService.updateStudent(id, student);
      setStudents(prevStudents =>
        prevStudents.map(s => (s.id === id ? { ...s, ...student } : s))
      );
      toast.success('Data siswa berhasil diperbarui');
    } catch (error) {
      console.error('Failed to update student:', error);
      toast.error('Gagal memperbarui data siswa');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteStudent = async (id: string) => {
    try {
      setIsLoading(true);
      await dbService.deleteStudent(id);
      setStudents(prevStudents => prevStudents.filter(s => s.id !== id));
      toast.success('Siswa berhasil dihapus');
    } catch (error) {
      console.error('Failed to delete student:', error);
      toast.error('Gagal menghapus siswa');
    } finally {
      setIsLoading(false);
    }
  };

  // Teacher CRUD functions
  const addTeacher = async (teacher: Omit<Teacher, 'id'>) => {
    try {
      setIsLoading(true);
      const newTeacher = await dbService.createTeacher(teacher);
      setTeachers(prevTeachers => [...prevTeachers, newTeacher]);
      toast.success('Guru berhasil ditambahkan');
    } catch (error) {
      console.error('Failed to add teacher:', error);
      toast.error('Gagal menambahkan guru');
    } finally {
      setIsLoading(false);
    }
  };

  const updateTeacher = async (id: string, teacher: Omit<Teacher, 'id'>) => {
    try {
      setIsLoading(true);
      await dbService.updateTeacher(id, teacher);
      setTeachers(prevTeachers =>
        prevTeachers.map(t => (t.id === id ? { ...t, ...teacher } : t))
      );
      toast.success('Data guru berhasil diperbarui');
    } catch (error) {
      console.error('Failed to update teacher:', error);
      toast.error('Gagal memperbarui data guru');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTeacher = async (id: string) => {
    try {
      setIsLoading(true);
      await dbService.deleteTeacher(id);
      setTeachers(prevTeachers => prevTeachers.filter(t => t.id !== id));
      toast.success('Guru berhasil dihapus');
    } catch (error) {
      console.error('Failed to delete teacher:', error);
      toast.error('Gagal menghapus guru');
    } finally {
      setIsLoading(false);
    }
  };

  // Subject CRUD functions
  const addSubject = async (subject: Omit<Subject, 'id'>) => {
    try {
      setIsLoading(true);
      const newSubject = await dbService.createSubject(subject);
      setSubjects(prevSubjects => [...prevSubjects, newSubject]);
      toast.success('Mata pelajaran berhasil ditambahkan');
    } catch (error) {
      console.error('Failed to add subject:', error);
      toast.error('Gagal menambahkan mata pelajaran');
    } finally {
      setIsLoading(false);
    }
  };

  const updateSubject = async (id: string, subject: Omit<Subject, 'id'>) => {
    try {
      setIsLoading(true);
      await dbService.updateSubject(id, subject);
      setSubjects(prevSubjects =>
        prevSubjects.map(s => (s.id === id ? { ...s, ...subject } : s))
      );
      toast.success('Data mata pelajaran berhasil diperbarui');
    } catch (error) {
      console.error('Failed to update subject:', error);
      toast.error('Gagal memperbarui data mata pelajaran');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteSubject = async (id: string) => {
    try {
      setIsLoading(true);
      await dbService.deleteSubject(id);
      setSubjects(prevSubjects => prevSubjects.filter(s => s.id !== id));
      toast.success('Mata pelajaran berhasil dihapus');
    } catch (error) {
      console.error('Failed to delete subject:', error);
      toast.error('Gagal menghapus mata pelajaran');
    } finally {
      setIsLoading(false);
    }
  };

  // Schedule CRUD functions
  const addSchedule = async (schedule: Omit<Schedule, 'id'>) => {
    try {
      setIsLoading(true);
      const newSchedule = await dbService.createSchedule(schedule);
      setSchedules(prevSchedules => [...prevSchedules, newSchedule]);
      toast.success('Jadwal berhasil ditambahkan');
    } catch (error) {
      console.error('Failed to add schedule:', error);
      toast.error('Gagal menambahkan jadwal');
    } finally {
      setIsLoading(false);
    }
  };

  const updateSchedule = async (id: string, schedule: Omit<Schedule, 'id'>) => {
    try {
      setIsLoading(true);
      await dbService.updateSchedule(id, schedule);
      setSchedules(prevSchedules =>
        prevSchedules.map(s => (s.id === id ? { ...s, ...schedule } : s))
      );
      toast.success('Data jadwal berhasil diperbarui');
    } catch (error) {
      console.error('Failed to update schedule:', error);
      toast.error('Gagal memperbarui data jadwal');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteSchedule = async (id: string) => {
    try {
      setIsLoading(true);
      await dbService.deleteSchedule(id);
      setSchedules(prevSchedules => prevSchedules.filter(s => s.id !== id));
      toast.success('Jadwal berhasil dihapus');
    } catch (error) {
      console.error('Failed to delete schedule:', error);
      toast.error('Gagal menghapus jadwal');
    } finally {
      setIsLoading(false);
    }
  };

  // Attendance functions
  const addAttendance = async (attendance: Omit<Attendance, 'id'>) => {
    try {
      setIsLoading(true);
      // Using the createAttendance method from dbService
      const newAttendance = await dbService.createAttendance(attendance);
      toast.success('Absensi berhasil ditambahkan');
      return newAttendance;
    } catch (error) {
      console.error('Failed to add attendance:', error);
      toast.error('Gagal menambahkan absensi');
    } finally {
      setIsLoading(false);
    }
  };

  // Create the context value object
  const contextValue: AppContextType = {
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
    addAttendance,
    isLoading,
    hasError,
    databaseError,
    retryDatabaseConnection,
    resetSession,
    lastActivityTime,
    updateLastActivityTime,
    refreshData,
    getTeacherById,
    getSubjectById
  };

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};
