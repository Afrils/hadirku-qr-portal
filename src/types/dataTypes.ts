
export type Student = {
  id: string;
  student_id: string;
  name: string;
  class: string;
  email: string;
  created_at?: string;
  updated_at?: string;
};

export type Teacher = {
  id: string;
  teacher_id: string;
  name: string;
  email: string;
  subject_id?: string;
  created_at?: string;
  updated_at?: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'teacher';
  created_at?: string;
  updated_at?: string;
};

export type Subject = {
  id: string;
  name: string;
  code: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
};

export type Schedule = {
  id: string;
  subject_id: string;
  teacher_id: string;
  class: string;
  day_of_week: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday';
  start_time: string;
  end_time: string;
  created_at?: string;
  updated_at?: string;
};

export type Attendance = {
  id: string;
  schedule_id: string;
  student_id: string;
  date: string;
  status: 'present' | 'absent' | 'late' | 'sick' | 'permission';
  notes?: string;
  created_at?: string;
  updated_at?: string;
};


