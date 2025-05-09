
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

// Initialize database tables if they don't exist (this would normally be done via migrations or the Supabase UI)
// This function is for development purposes only
export const initializeDatabase = async () => {
  try {
    console.log('Checking and initializing database tables if needed...');
    
    // We'll instead rely on tables being created manually in Supabase dashboard
    // or through proper migrations in a production environment
    
    // In a real application, you'd typically set up your tables through 
    // the Supabase interface and then just use them here
    
    return { success: true };
  } catch (error) {
    console.error('Error initializing database:', error);
    return { success: false, error };
  }
};
