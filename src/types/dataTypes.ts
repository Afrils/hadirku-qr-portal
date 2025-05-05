
export type Student = {
  id: string;
  studentId: string;
  name: string;
  class: string;
  email: string;
  password?: string;
  created_at?: string;
  updated_at?: string;
};

export type Teacher = {
  id: string;
  teacherId: string;
  name: string;
  email: string;
  password?: string;
  subjectId?: string;
  subjects?: string[];
  created_at?: string;
  updated_at?: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'teacher' | 'student';
  roleId?: string;
  created_at?: string;
  updated_at?: string;
};

export type Subject = {
  id: string;
  name: string;
  code: string;
  teacherId?: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
};

export type Schedule = {
  id: string;
  subjectId: string;
  teacherId: string;
  class: string;
  dayOfWeek: 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu' | 'Minggu';
  startTime: string;
  endTime: string;
  roomNumber: string;
  created_at?: string;
  updated_at?: string;
};

export type Attendance = {
  id: string;
  scheduleId: string;
  studentId: string;
  subjectId: string;
  date: string;
  status: 'present' | 'absent' | 'late' | 'sick' | 'permission';
  timestamp: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
};

export type Admin = {
  id: string;
  name: string;
  email: string;
  password: string;
  created_at?: string;
  updated_at?: string;
};
