
import { Capacitor } from '@capacitor/core';
import { platformDbAdapter } from '../services/platformDbAdapter';

/**
 * Initialize Capacitor and platform-specific features
 */
export const initCapacitor = async () => {
  // Initialize platform database adapter
  await platformDbAdapter.init();
  
  console.log("Running on: ", Capacitor.getPlatform());
  
  // Check if we're running on Android
  if (Capacitor.getPlatform() === 'android') {
    console.log('Running on Android platform');
    setupAndroidSpecifics();
  }
};

/**
 * Configure Android-specific features
 */
function setupAndroidSpecifics() {
  // Add Android-specific configurations here
  // For example, handle back button, status bar, etc.
  
  // Set up periodic sync with the server if needed
  setupPeriodicSync();
}

/**
 * Set up periodic data synchronization
 * This would sync local database with remote server
 */
function setupPeriodicSync() {
  // Set up a periodic sync every 5 minutes
  setInterval(async () => {
    try {
      await platformDbAdapter.syncWithRemote();
      console.log('Data sync completed successfully');
    } catch (error) {
      console.error('Error syncing data:', error);
    }
  }, 5 * 60 * 1000); // 5 minutes
}
