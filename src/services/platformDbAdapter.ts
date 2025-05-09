
import { dbService } from './dbService';
import { supabase, initializeDatabase } from './supabaseClient';
import { Capacitor } from '@capacitor/core';

// This adapter helps ensure smooth database operations across platforms (web, Android)
export const platformDbAdapter = {
  /**
   * Initialize database connection based on platform
   */
  init: async () => {
    if (isPlatformAndroid()) {
      console.log('Android platform detected, initializing database connection');
      // Initialize storage that's appropriate for the platform
      // For Android, we'll still use Supabase but might set up additional offline capabilities
    }
    
    // Initialize Supabase database connection and tables
    try {
      await initializeDatabase();
      console.log('Database connection initialized successfully');
    } catch (error) {
      console.error('Error initializing database:', error);
    }
    
    return dbService;
  },

  /**
   * Get current database service
   */
  getDbService: () => {
    return dbService;
  },

  /**
   * Sync local data with remote server
   */
  syncWithRemote: async () => {
    // For offline-first functionality (potential future implementation)
    // This would sync any locally cached data with Supabase when online
    console.log('Sync with remote database requested');
    
    // For now just return a resolved promise
    return Promise.resolve({ success: true });
  },
  
  /**
   * Get Supabase client directly if needed
   */
  getSupabaseClient: () => {
    return supabase;
  }
};

/**
 * Detect if running on Android platform
 */
function isPlatformAndroid(): boolean {
  // Check for Android platform using Capacitor
  try {
    return Capacitor.getPlatform() === 'android';
  } catch (e) {
    return false;
  }
}

/**
 * Single entry point for database access
 */
export const getDatabase = () => platformDbAdapter.getDbService();
