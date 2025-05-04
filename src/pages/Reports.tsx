
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAppContext } from '@/contexts/AppContext';
import { dbService } from '@/services/dbService';
import { Attendance, Student, Subject } from '@/types/dataTypes';
import { Download } from 'lucide-react';
import * as XLSX from 'xlsx';
import { toast } from '@/components/ui/sonner';

const Reports = () => {
  const { students, subjects } = useAppContext();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  
  const handleGenerateReport = () => {
    if (!startDate || !endDate) {
      toast.error('Pilih rentang tanggal terlebih dahulu!');
      return;
    }
    
    const report = dbService.getAttendanceReport(
      startDate,
      endDate,
      selectedSubject || undefined,
      selectedStudent || undefined
    );
    
    setAttendances(report);
  };
  
  const exportToExcel = () => {
    if (attendances.length === 0) {
      toast.error('Tidak ada data untuk diekspor!');
      return;
    }
    
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
    
    // Generate filename
    const fileName = `laporan-presensi-${startDate}-to-${endDate}.xlsx`;
    
    // Write and download
    XLSX.writeFile(wb, fileName);
    
    toast.success('Laporan berhasil diekspor!');
  };
  
  const formatStatusLabel = (status: string) => {
    switch (status) {
      case 'present': return 'Hadir';
      case 'late': return 'Terlambat';
      case 'absent': return 'Tidak Hadir';
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Laporan Presensi</h2>
      
      <Card>
        <CardHeader>
          <CardTitle>Filter Laporan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Tanggal Mulai</Label>
              <Input 
                id="startDate" 
                type="date" 
                value={startDate} 
                onChange={(e) => setStartDate(e.target.value)} 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="endDate">Tanggal Selesai</Label>
              <Input 
                id="endDate" 
                type="date" 
                value={endDate} 
                onChange={(e) => setEndDate(e.target.value)} 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="subject">Mata Pelajaran</Label>
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger>
                  <SelectValue placeholder="Semua mata pelajaran" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Semua mata pelajaran</SelectItem>
                  {subjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="student">Siswa</Label>
              <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                <SelectTrigger>
                  <SelectValue placeholder="Semua siswa" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Semua siswa</SelectItem>
                  {students.map((student) => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex items-center justify-end gap-2">
            <Button onClick={handleGenerateReport}>Tampilkan Laporan</Button>
          </div>
        </CardContent>
      </Card>
      
      {attendances.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Hasil Laporan</CardTitle>
            <Button onClick={exportToExcel} variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              <span>Ekspor Excel</span>
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Waktu</TableHead>
                  <TableHead>Nama Siswa</TableHead>
                  <TableHead>ID Siswa</TableHead>
                  <TableHead>Kelas</TableHead>
                  <TableHead>Mata Pelajaran</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendances.map((attendance) => {
                  const student = students.find(s => s.id === attendance.studentId) as Student;
                  const subject = subjects.find(s => s.id === attendance.subjectId) as Subject;
                  
                  return (
                    <TableRow key={attendance.id}>
                      <TableCell>
                        {new Date(attendance.date).toLocaleDateString('id-ID')}
                      </TableCell>
                      <TableCell>
                        {new Date(attendance.timestamp).toLocaleTimeString('id-ID')}
                      </TableCell>
                      <TableCell>{student?.name || 'Unknown'}</TableCell>
                      <TableCell>{student?.studentId || 'Unknown'}</TableCell>
                      <TableCell>{student?.class || 'Unknown'}</TableCell>
                      <TableCell>{subject?.name || 'Unknown'}</TableCell>
                      <TableCell>
                        <span className={cn(
                          'px-2 py-1 rounded-full text-xs',
                          attendance.status === 'present' ? 'bg-green-100 text-green-800' :
                          attendance.status === 'late' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        )}>
                          {formatStatusLabel(attendance.status)}
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Reports;
