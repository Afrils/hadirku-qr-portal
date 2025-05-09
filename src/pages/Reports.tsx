
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAppContext } from '@/contexts/AppContext';
import { dbService } from '@/services/dbService';
import { Attendance, Student, Subject } from '@/types/dataTypes';
import { exportAttendancesToExcel } from '@/utils/exportUtils';
import { cn } from '@/lib/utils';

const Reports: React.FC = () => {
  const { students, subjects, refreshData } = useAppContext();
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [filteredAttendances, setFilteredAttendances] = useState<Attendance[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');

  useEffect(() => {
    // Load all attendance records - properly handling the promise
    const loadAttendances = async () => {
      try {
        const allAttendances = await dbService.getAllAttendances();
        setAttendances(allAttendances);
        setFilteredAttendances(allAttendances);
      } catch (error) {
        console.error('Error loading attendance data:', error);
      }
    };
    
    loadAttendances();
  }, []);

  const handleFilter = () => {
    let filtered = [...attendances];
    
    if (selectedSubject) {
      filtered = filtered.filter(a => a.subjectId === selectedSubject);
    }
    
    if (selectedStudent) {
      filtered = filtered.filter(a => a.studentId === selectedStudent);
    }
    
    if (selectedStatus) {
      filtered = filtered.filter(a => a.status === selectedStatus);
    }
    
    if (dateFrom) {
      filtered = filtered.filter(a => new Date(a.date) >= new Date(dateFrom));
    }
    
    if (dateTo) {
      filtered = filtered.filter(a => new Date(a.date) <= new Date(dateTo));
    }
    
    setFilteredAttendances(filtered);
  };

  const handleReset = () => {
    setSelectedSubject('');
    setSelectedStudent('');
    setSelectedStatus('');
    setDateFrom('');
    setDateTo('');
    setFilteredAttendances(attendances);
  };

  const handleExport = () => {
    const fileName = `attendance-report-${new Date().toISOString().split('T')[0]}.xlsx`;
    exportAttendancesToExcel(filteredAttendances, students, subjects, fileName);
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'present':
        return 'bg-green-100 text-green-800';
      case 'absent':
        return 'bg-red-100 text-red-800';
      case 'late':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Helper function to get student name
  const getStudentName = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    return student ? student.name : 'Unknown Student';
  };

  // Helper function to get subject name
  const getSubjectName = (subjectId: string) => {
    const subject = subjects.find(s => s.id === subjectId);
    return subject ? subject.name : 'Unknown Subject';
  };

  // Helper function to format status
  const formatStatus = (status: string) => {
    switch (status) {
      case 'present':
        return 'Hadir';
      case 'absent':
        return 'Tidak Hadir';
      case 'late':
        return 'Terlambat';
      default:
        return status;
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
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="subject">Mata Pelajaran</Label>
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih mata pelajaran" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Mata Pelajaran</SelectItem>
                  {subjects.map(subject => (
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
                  <SelectValue placeholder="Pilih siswa" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Siswa</SelectItem>
                  {students.map(student => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status Presensi</Label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="present">Hadir</SelectItem>
                  <SelectItem value="late">Terlambat</SelectItem>
                  <SelectItem value="absent">Tidak Hadir</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dateFrom">Dari Tanggal</Label>
              <Input
                id="dateFrom"
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dateTo">Sampai Tanggal</Label>
              <Input
                id="dateTo"
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>
            
            <div className="flex items-end space-x-2">
              <Button onClick={handleFilter}>Filter</Button>
              <Button variant="outline" onClick={handleReset}>Reset</Button>
              <Button variant="outline" onClick={handleExport}>Export Excel</Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Data Presensi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Tanggal</th>
                  <th className="text-left p-2">Waktu</th>
                  <th className="text-left p-2">Siswa</th>
                  <th className="text-left p-2">Mata Pelajaran</th>
                  <th className="text-left p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredAttendances.length > 0 ? (
                  filteredAttendances.map((attendance) => (
                    <tr key={attendance.id} className="border-b hover:bg-gray-50">
                      <td className="p-2">{formatDate(attendance.date)}</td>
                      <td className="p-2">{formatTime(attendance.timestamp)}</td>
                      <td className="p-2">{getStudentName(attendance.studentId)}</td>
                      <td className="p-2">{getSubjectName(attendance.subjectId)}</td>
                      <td className="p-2">
                        <span className={cn("px-2 py-1 rounded-full text-xs font-medium", getStatusClass(attendance.status))}>
                          {formatStatus(attendance.status)}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-4 text-center text-gray-500">
                      Tidak ada data presensi yang sesuai dengan filter
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
