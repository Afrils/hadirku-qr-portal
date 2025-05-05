
// This is a browser-safe implementation that redirects to dbService
import { dbService } from './dbService';

// Re-export dbService as mysqlService for compatibility
export const mysqlService = dbService;
