import { supabase } from '@/integrations/supabase/client';
import { Student, Teacher, Subject, Schedule, User, Attendance } from '@/types/dataTypes';

class DatabaseService {
  // Add the missing initDatabase method
  async initDatabase(): Promise<void> {
    console.log('Database initialization complete - tables already exist');
  }

  async login(email: string, password: string): Promise<User | null> {
    try {
      const { data: users, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .eq('password', password);

      if (error) {
        console.error('Error during login:', error);
        return null;
      }

      if (users && users.length > 0) {
        const user = users[0];
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          password: user.password,
          role: user.role as 'admin' | 'teacher' | 'student',
          roleId: user.role_id,
          created_at: '',
          updated_at: '',
        };
      } else {
        return null; // User not found or invalid credentials
      }
    } catch (error) {
      console.error('Error during login:', error);
      return null;
    }
  }

  logout() {
    console.log('logout');
  }

  // Student operations
  async createStudent(student: Omit<Student, 'id'>): Promise<Student> {
    const { data, error } = await supabase
      .from('students')
      .insert({
        name: student.name,
        student_id: student.studentId,
        class: student.class,
        email: student.email,
        password: student.password || '123456'
      })
      .select()
      .single();

    if (error) throw error;
    
    return {
      id: data.id,
      name: data.name,
      studentId: data.student_id,
      class: data.class,
      email: data.email,
      password: data.password
    };
  }

  async updateStudent(id: string, student: Omit<Student, 'id'>): Promise<void> {
    const { error } = await supabase
      .from('students')
      .update({
        name: student.name,
        student_id: student.studentId,
        class: student.class,
        email: student.email,
        password: student.password || '123456'
      })
      .eq('id', id);

    if (error) throw error;
  }

  async deleteStudent(id: string): Promise<void> {
    const { error } = await supabase.from('students').delete().eq('id', id);
    if (error) throw error;
  }

  async getAllStudents(): Promise<Student[]> {
    const { data, error } = await supabase.from('students').select('*');
    if (error) throw error;
    
    return data.map(student => ({
      id: student.id,
      name: student.name,
      studentId: student.student_id,
      class: student.class,
      email: student.email,
      password: student.password
    }));
  }

  async getStudentById(id: string): Promise<Student | null> {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching student by ID:', error);
      return null;
    }

    if (data) {
      return {
        id: data.id,
        name: data.name,
        studentId: data.student_id,
        class: data.class,
        email: data.email,
        password: data.password
      };
    }

    return null;
  }

  // Teacher operations
  async createTeacher(teacher: Omit<Teacher, 'id'>): Promise<Teacher> {
    const { data, error } = await supabase
      .from('teachers')
      .insert({
        name: teacher.name,
        teacher_id: teacher.teacherId,
        email: teacher.email,
        subjects: teacher.subjects || [],
        password: teacher.password || '123456'
      })
      .select()
      .single();

    if (error) throw error;
    
    return {
      id: data.id,
      name: data.name,
      teacherId: data.teacher_id,
      email: data.email,
      subjects: data.subjects,
      password: data.password
    };
  }

  async updateTeacher(id: string, teacher: Omit<Teacher, 'id'>): Promise<void> {
    const { error } = await supabase
      .from('teachers')
      .update({
        name: teacher.name,
        teacher_id: teacher.teacherId,
        email: teacher.email,
        subjects: teacher.subjects || [],
        password: teacher.password || '123456'
      })
      .eq('id', id);

    if (error) throw error;
  }

  async deleteTeacher(id: string): Promise<void> {
    const { error } = await supabase.from('teachers').delete().eq('id', id);
    if (error) throw error;
  }

  async getAllTeachers(): Promise<Teacher[]> {
    const { data, error } = await supabase.from('teachers').select('*');
    if (error) throw error;

    return data.map(teacher => ({
      id: teacher.id,
      name: teacher.name,
      teacherId: teacher.teacher_id,
      email: teacher.email,
      subjects: teacher.subjects,
      password: teacher.password
    }));
  }

  async getTeacherById(id: string): Promise<Teacher | null> {
    const { data, error } = await supabase
      .from('teachers')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching teacher by ID:', error);
      return null;
    }

    if (data) {
      return {
        id: data.id,
        name: data.name,
        teacherId: data.teacher_id,
        email: data.email,
        subjects: data.subjects,
        password: data.password
      };
    }

    return null;
  }

  // Subject operations
  async createSubject(subject: Omit<Subject, 'id'>): Promise<Subject> {
    const { data, error } = await supabase
      .from('subjects')
      .insert(subject)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateSubject(id: string, subject: Omit<Subject, 'id'>): Promise<void> {
    const { error } = await supabase.from('subjects').update(subject).eq('id', id);
    if (error) throw error;
  }

  async deleteSubject(id: string): Promise<void> {
    const { error } = await supabase.from('subjects').delete().eq('id', id);
    if (error) throw error;
  }

  async getAllSubjects(): Promise<Subject[]> {
    const { data, error } = await supabase.from('subjects').select('*');
    if (error) throw error;
    return data;
  }

  async getSubjectById(id: string): Promise<Subject | null> {
    const { data, error } = await supabase
      .from('subjects')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching subject by ID:', error);
      return null;
    }

    return data || null;
  }

  // Schedule operations
  async createSchedule(schedule: Omit<Schedule, 'id'>): Promise<Schedule> {
    const { data, error } = await supabase
      .from('schedules')
      .insert({
        subject_id: schedule.subjectId,
        teacher_id: schedule.teacherId,
        class: schedule.class,
        day_of_week: schedule.dayOfWeek,
        start_time: schedule.startTime,
        end_time: schedule.endTime,
        room_number: schedule.roomNumber
      })
      .select()
      .single();

    if (error) throw error;
    
    return {
      id: data.id,
      subjectId: data.subject_id,
      teacherId: data.teacher_id,
      class: data.class,
      dayOfWeek: data.day_of_week as 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu' | 'Minggu',
      startTime: data.start_time,
      endTime: data.end_time,
      roomNumber: data.room_number
    };
  }

  async updateSchedule(id: string, schedule: Omit<Schedule, 'id'>): Promise<void> {
    const { error } = await supabase
      .from('schedules')
      .update({
        subject_id: schedule.subjectId,
        teacher_id: schedule.teacherId,
        class: schedule.class,
        day_of_week: schedule.dayOfWeek,
        start_time: schedule.startTime,
        end_time: schedule.endTime,
        room_number: schedule.roomNumber
      })
      .eq('id', id);

    if (error) throw error;
  }

  async deleteSchedule(id: string): Promise<void> {
    const { error } = await supabase.from('schedules').delete().eq('id', id);
    if (error) throw error;
  }

  async getAllSchedules(): Promise<Schedule[]> {
    const { data, error } = await supabase.from('schedules').select('*');
    if (error) throw error;
    
    return data.map(schedule => ({
      id: schedule.id,
      subjectId: schedule.subject_id,
      teacherId: schedule.teacher_id,
      class: schedule.class,
      dayOfWeek: schedule.day_of_week as 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu' | 'Minggu',
      startTime: schedule.start_time,
      endTime: schedule.end_time,
      roomNumber: schedule.room_number
    }));
  }

  // Attendance operations
  async createAttendance(attendance: Omit<Attendance, 'id'>): Promise<Attendance> {
    const { data, error } = await supabase
      .from('attendances')
      .insert({
        student_id: attendance.studentId,
        schedule_id: attendance.scheduleId,
        subject_id: attendance.subjectId,
        date: attendance.date,
        status: attendance.status,
        timestamp: attendance.timestamp
      })
      .select()
      .single();

    if (error) throw error;
    
    return {
      id: data.id,
      studentId: data.student_id,
      scheduleId: data.schedule_id,
      subjectId: data.subject_id,
      date: data.date,
      status: data.status as 'present' | 'absent' | 'late' | 'sick' | 'permission',
      timestamp: data.timestamp
    };
  }

  // Add the missing getAllAttendances method
  async getAllAttendances(): Promise<Attendance[]> {
    const { data, error } = await supabase.from('attendances').select('*');
    if (error) throw error;
    
    return data.map(attendance => ({
      id: attendance.id,
      studentId: attendance.student_id,
      scheduleId: attendance.schedule_id,
      subjectId: attendance.subject_id,
      date: attendance.date,
      status: attendance.status as 'present' | 'absent' | 'late' | 'sick' | 'permission',
      timestamp: attendance.timestamp
    }));
  }

  async getAttendanceReport(
    startDate: string,
    endDate: string,
    subjectId?: string,
    studentId?: string
  ): Promise<Attendance[]> {
    let query = supabase
      .from('attendances')
      .select('*')
      .gte('date', startDate)
      .lte('date', endDate);

    if (subjectId) {
      query = query.eq('subject_id', subjectId);
    }

    if (studentId) {
      query = query.eq('student_id', studentId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching attendance report:', error);
      throw error;
    }

    return data.map(attendance => ({
      id: attendance.id,
      studentId: attendance.student_id,
      scheduleId: attendance.schedule_id,
      subjectId: attendance.subject_id,
      date: attendance.date,
      status: attendance.status as 'present' | 'absent' | 'late' | 'sick' | 'permission',
      timestamp: attendance.timestamp
    }));
  }

  // User operations
  async createUser(user: Omit<User, 'id'>): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .insert({
        name: user.name,
        email: user.email,
        password: user.password,
        role: user.role,
        role_id: user.roleId
      })
      .select()
      .single();

    if (error) throw error;
    
    return {
      id: data.id,
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role as 'admin' | 'teacher' | 'student',
      roleId: data.role_id,
      created_at: '',
      updated_at: '',
    };
  }
}

export const dbService = new DatabaseService();
