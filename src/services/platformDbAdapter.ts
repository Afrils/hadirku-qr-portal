
import { dbService } from './dbService';

// This adapter helps ensure smooth database operations across platforms (web, Android)
export const platformDbAdapter = {
  /**
   * Initialize database connection based on platform
   */
  init: () => {
    if (isPlatformAndroid()) {
      console.log('Android platform detected, initializing local storage');
      // Currently using localStorage on both platforms, but this provides an extension point
      // for platform-specific storage in the future
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
   * Sync local data with remote server (for future implementation)
   */
  syncWithRemote: async () => {
    // This would be implemented when you have a remote database server
    console.log('Sync with remote database requested');
    // For now just return a resolved promise
    return Promise.resolve({ success: true });
  }
};

/**
 * Detect if running on Android platform
 */
function isPlatformAndroid(): boolean {
  // Check for Android platform using Capacitor
  try {
    // This will be replaced with proper Capacitor platform detection
    // when Capacitor is fully initialized
    return typeof window !== 'undefined' && 
           /Android/i.test(navigator.userAgent);
  } catch (e) {
    return false;
  }
}

/**
 * Single entry point for database access
 */
export const getDatabase = () => platformDbAdapter.getDbService();
