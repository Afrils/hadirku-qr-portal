
export type Student = {
  id: string;
  name: string;
  studentId: string;
  class: string;
  email: string;
  password?: string; // For authentication
};

export type Teacher = {
  id: string;
  name: string;
  teacherId: string;
  email: string;
  subjects: string[];
  password?: string; // For authentication
};

export type Admin = {
  id: string;
  name: string;
  email: string;
  password: string;
};

export type UserRole = 'student' | 'teacher' | 'admin';

export type User = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  roleId: string; // References the ID in the role-specific table
};

export type Subject = {
  id: string;
  name: string;
  code: string;
  teacherId: string;
};

export type Schedule = {
  id: string;
  subjectId: string;
  teacherId: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  roomNumber: string;
};

export type Attendance = {
  id: string;
  studentId: string;
  scheduleId: string;
  subjectId: string;
  date: string;
  status: 'present' | 'absent' | 'late';
  timestamp: string;
};
