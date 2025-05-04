
/**
 * Generates a QR code data for attendance based on the provided parameters
 * @param scheduleId The ID of the schedule
 * @param subjectId The ID of the subject
 * @param date The date of the class (ISO string format)
 * @returns A string in the format suitable for QR code generation
 */
export const generateQRData = (scheduleId: string, subjectId: string, date: string): string => {
  // Create a data structure for the QR code
  const qrData = {
    scheduleId,
    subjectId,
    date,
    timestamp: new Date().toISOString(),
    expiresIn: '15m', // QR code valid for 15 minutes
  };
  
  // Convert to JSON string
  return JSON.stringify(qrData);
};

/**
 * Parses QR code data
 * @param qrData The QR code data string
 * @returns Parsed QR data object or null if invalid
 */
export const parseQRData = (qrData: string) => {
  try {
    return JSON.parse(qrData);
  } catch (error) {
    console.error('Invalid QR data format', error);
    return null;
  }
};

/**
 * Checks if a QR code is still valid based on its timestamp and expiration
 * @param qrData The parsed QR data object
 * @returns Boolean indicating if the QR code is still valid
 */
export const isQRCodeValid = (qrData: any): boolean => {
  if (!qrData || !qrData.timestamp || !qrData.expiresIn) {
    return false;
  }

  const createdAt = new Date(qrData.timestamp).getTime();
  const now = Date.now();
  
  // Parse expiration time (e.g., "15m" to milliseconds)
  const expiresInMs = parseExpirationToMs(qrData.expiresIn);
  
  return now - createdAt < expiresInMs;
};

/**
 * Parses expiration time string to milliseconds
 * @param expiration Expiration string like "15m", "1h"
 * @returns Milliseconds representation of the expiration time
 */
const parseExpirationToMs = (expiration: string): number => {
  const unit = expiration.slice(-1);
  const value = parseInt(expiration.slice(0, -1), 10);
  
  switch(unit) {
    case 's':
      return value * 1000;
    case 'm':
      return value * 60 * 1000;
    case 'h':
      return value * 60 * 60 * 1000;
    case 'd':
      return value * 24 * 60 * 60 * 1000;
    default:
      return 0; // Invalid format
  }
};
