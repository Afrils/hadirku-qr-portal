
import { dbService } from '../services/dbService';

// This is a browser-safe database configuration that will use localStorage
// instead of MySQL when running in a browser environment

// Export the dbService as the default database interface
export default dbService;
