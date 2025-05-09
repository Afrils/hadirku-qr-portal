
import { createClient } from '@supabase/supabase-js';
import { Student, Teacher, Subject, Schedule, Attendance, Admin, User } from '../types/dataTypes';

// Supabase configuration
const supabaseUrl = 'https://quiyupmtvcsfhnujogug.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF1aXl1cG10dmNzZmhudWpvZ3VnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY2NjkzMTgsImV4cCI6MjA2MjI0NTMxOH0.RF6P-2mXoZxCJ_EV8KfYr0TEhi_GyakbCycZIjrOJLQ';

// Initialize the Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey);

// Database table names
export const TABLES = {
  STUDENTS: 'students',
  TEACHERS: 'teachers',
  ADMINS: 'admins',
  USERS: 'users',
  SUBJECTS: 'subjects',
  SCHEDULES: 'schedules',
  ATTENDANCES: 'attendances',
};

// Helper function to handle Supabase errors
export const handleSupabaseError = (error: any, operation: string) => {
  console.error(`Supabase error during ${operation}:`, error);
  throw new Error(`Error during ${operation}: ${error.message || 'Unknown error'}`);
};

// Helper function to check if a table exists
const tableExists = async (tableName: string): Promise<boolean> => {
  try {
    // Use system tables to check if our table exists
    const { data, error } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_name', tableName)
      .eq('table_schema', 'public');
      
    return !error && data && data.length > 0;
  } catch (error) {
    console.warn(`Could not check if table ${tableName} exists:`, error);
    return false;
  }
};

// SQL statement to create tables if they don't exist
const createTablesSql = `
-- Create tables if they don't exist
CREATE TABLE IF NOT EXISTS public.students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nisn VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  class VARCHAR(20) NOT NULL,
  email VARCHAR(100),
  password VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.teachers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nip VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100),
  password VARCHAR(100) NOT NULL,
  subject_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.admins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  role VARCHAR(20) NOT NULL,
  roleId UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.subjects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.schedules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subjectId UUID NOT NULL,
  teacherId UUID,
  dayOfWeek VARCHAR(20) NOT NULL,
  startTime VARCHAR(10) NOT NULL,
  endTime VARCHAR(10) NOT NULL,
  roomNumber VARCHAR(10),
  classGroup VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.attendances (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  studentId UUID NOT NULL,
  scheduleId UUID NOT NULL,
  subjectId UUID NOT NULL,
  date DATE NOT NULL,
  status VARCHAR(20) NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
`;

// Initialize database tables if they don't exist
export const initializeDatabase = async () => {
  try {
    console.log('Checking and initializing database tables if needed...');
    
    // Enable the pgcrypto extension for UUID generation if not already enabled
    try {
      await supabase.rpc('extensions', { 
        name: 'pgcrypto' 
      });
      console.log('pgcrypto extension enabled');
    } catch (err) {
      console.warn('Could not enable pgcrypto extension, might already be enabled:', err);
    }
    
    // Check if key tables exist
    const studentTableExists = await tableExists(TABLES.STUDENTS);
    
    if (!studentTableExists) {
      console.log('Creating database tables...');
      
      // Create tables using SQL
      const { error } = await supabase.rpc('exec_sql', { sql: createTablesSql });
      
      if (error) {
        console.error('Error creating tables:', error);
        
        // Fallback: Try to create tables one by one using the REST API
        console.log('Attempting fallback table creation...');
        
        // Here we would implement individual table creation
        // But it's better to ask the user to create tables via the Supabase interface
        // for proper structure and relationships
        
        throw new Error(`Could not create database tables automatically: ${error.message}`);
      } else {
        console.log('Database tables created successfully!');
      }
    } else {
      console.log('Database tables already exist. Skipping creation.');
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error initializing database:', error);
    return { 
      success: false, 
      error,
      message: 'Failed to initialize database. If this persists, please create the tables manually in the Supabase dashboard.' 
    };
  }
};

