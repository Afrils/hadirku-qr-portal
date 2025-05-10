
import { createClient } from '@supabase/supabase-js';
import { Student, Teacher, Subject, Schedule, Attendance, Admin, User } from '../types/dataTypes';

// Supabase configuration
const supabaseUrl = 'https://quiyupmtvcsfhnujogug.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF1aXl1cG10dmNzZmhudWpvZ3VnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY2NjkzMTgsImV4cCI6MjA2MjI0NTMxOH0.RF6P-2mXoZxCJ_EV8KfYr0TEhi_GyakbCycZIjrOJLQ';

// Initialize the Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
});

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

// Initialize database tables if they don't exist
export const initializeDatabase = async () => {
  try {
    console.log('Checking and initializing database tables if needed...');
    
    // Check if the tables exist
    const tablesExist = await Promise.all(
      Object.values(TABLES).map(table => tableExists(table))
    );
    
    if (tablesExist.every(exists => exists)) {
      console.log('All tables exist, no need to initialize');
      return { success: true };
    }
    
    console.log('Some tables do not exist, they should have been created via SQL');
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
