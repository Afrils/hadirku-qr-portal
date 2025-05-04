
import * as XLSX from 'xlsx';
import { Attendance, Student, Subject } from '../types/dataTypes';

export const exportAttendancesToExcel = (
  attendances: Attendance[],
  students: Student[],
  subjects: Subject[],
  fileName: string
) => {
  // Transform data for export
  const exportData = attendances.map(attendance => {
    const student = students.find(s => s.id === attendance.studentId);
    const subject = subjects.find(s => s.id === attendance.subjectId);
    
    return {
      'Tanggal': new Date(attendance.date).toLocaleDateString('id-ID'),
      'Waktu': new Date(attendance.timestamp).toLocaleTimeString('id-ID'),
      'Nama Siswa': student?.name || 'Unknown',
      'ID Siswa': student?.studentId || 'Unknown',
      'Kelas': student?.class || 'Unknown',
      'Mata Pelajaran': subject?.name || 'Unknown',
      'Status': attendance.status === 'present' ? 'Hadir' : 
               attendance.status === 'late' ? 'Terlambat' : 'Tidak Hadir'
    };
  });
  
  // Create workbook and worksheet
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(exportData);
  
  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(wb, ws, "Attendance Report");
  
  // Write and download
  XLSX.writeFile(wb, fileName);
  
  return true;
};
