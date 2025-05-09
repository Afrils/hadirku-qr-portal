
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
    // Query for the table in Supabase
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .limit(1);
    
    // If there's no error, the table exists
    return !error;
  } catch (error) {
    console.warn(`Could not check if table ${tableName} exists:`, error);
    return false;
  }
};

// Execute SQL statement directly
const executeSQL = async (sql: string): Promise<boolean> => {
  try {
    const { error } = await supabase.rpc('exec_sql', { sql });
    if (error) {
      console.error('SQL execution error:', error);
      return false;
    }
    return true;
  } catch (error) {
    console.error('Failed to execute SQL:', error);
    return false;
  }
};

// SQL statement to create tables if they don't exist
const createTablesSql = `
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create tables if they don't exist
CREATE TABLE IF NOT EXISTS public.students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "studentId" VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  class VARCHAR(20) NOT NULL,
  email VARCHAR(100),
  password VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.teachers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "teacherId" VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100),
  password VARCHAR(100) NOT NULL,
  subjects TEXT[],
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
  password VARCHAR(100) NOT NULL,
  role VARCHAR(20) NOT NULL,
  "roleId" UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.subjects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  "teacherId" UUID,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.schedules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "subjectId" UUID NOT NULL,
  "teacherId" UUID,
  class VARCHAR(20) NOT NULL,
  "dayOfWeek" VARCHAR(20) NOT NULL,
  "startTime" VARCHAR(10) NOT NULL,
  "endTime" VARCHAR(10) NOT NULL,
  "roomNumber" VARCHAR(10),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.attendances (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "studentId" UUID NOT NULL,
  "scheduleId" UUID NOT NULL,
  "subjectId" UUID NOT NULL,
  date DATE NOT NULL,
  status VARCHAR(20) NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  notes TEXT,
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
    
    // Create tables directly using SQL
    console.log('Creating database tables...');
    
    // Execute SQL to create tables
    const createResult = await executeSQL(createTablesSql);
    
    if (!createResult) {
      console.error('Could not create database tables automatically');
      return { 
        success: false, 
        error: new Error('Could not create database tables automatically'),
        message: 'Failed to initialize database. Please check the Supabase console.' 
      };
    }
    
    console.log('Database tables created successfully!');
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
