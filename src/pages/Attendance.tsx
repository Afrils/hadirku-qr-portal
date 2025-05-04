
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAppContext } from '@/contexts/AppContext';
import { dbService } from '@/services/dbService';
import { Attendance, Student } from '@/types/dataTypes';
import { toast } from '@/components/ui/sonner';
import { format } from 'date-fns';

const AttendancePage = () => {
  const { subjects, schedules, refreshData } = useAppContext();
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredAttendances, setFilteredAttendances] = useState<Attendance[]>([]);
  
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedSchedule, setSelectedSchedule] = useState('');
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  
  // Load data
  useEffect(() => {
    loadData();
  }, []);
  
  const loadData = () => {
    const studentData = dbService.getAllStudents();
    const attendanceData = dbService.getAllAttendances();
    setStudents(studentData);
    setAttendances(attendanceData);
    setFilteredAttendances(attendanceData);
  };
  
  // Filter schedules based on selected subject
  const filteredSchedules = selectedSubject 
    ? schedules.filter(schedule => schedule.subjectId === selectedSubject)
    : [];
  
  // Apply filters
  useEffect(() => {
    let filtered = [...attendances];
    
    if (selectedSubject) {
      filtered = filtered.filter(a => a.subjectId === selectedSubject);
    }
    
    if (selectedSchedule) {
      filtered = filtered.filter(a => a.scheduleId === selectedSchedule);
    }
    
    if (selectedDate) {
      filtered = filtered.filter(a => a.date === selectedDate);
    }
    
    setFilteredAttendances(filtered);
  }, [selectedSubject, selectedSchedule, selectedDate, attendances]);
  
  // Find student name by ID
  const getStudentName = (id: string): string => {
    const student = students.find(s => s.id === id);
    return student ? student.name : 'Unknown Student';
  };
  
  // Get subject name by ID
  const getSubjectName = (id: string): string => {
    const subject = subjects.find(s => s.id === id);
    return subject ? subject.name : 'Unknown Subject';
  };
  
  // Format timestamp
  const formatTime = (timestamp: string): string => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Invalid time';
    }
  };
  
  // Status badge
  const StatusBadge = ({ status }: { status: string }) => {
    let badgeClass = 'px-2 py-1 text-xs font-medium rounded-full ';
    
    switch(status) {
      case 'present':
        badgeClass += 'bg-green-100 text-green-800';
        break;
      case 'late':
        badgeClass += 'bg-yellow-100 text-yellow-800';
        break;
      case 'absent':
        badgeClass += 'bg-red-100 text-red-800';
        break;
      default:
        badgeClass += 'bg-gray-100 text-gray-800';
    }
    
    return (
      <span className={badgeClass}>
        {status === 'present' ? 'Hadir' : status === 'late' ? 'Terlambat' : 'Absen'}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Data Presensi</h2>
      </div>

      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Mata Pelajaran</label>
            <Select 
              value={selectedSubject} 
              onValueChange={(value) => {
                setSelectedSubject(value);
                setSelectedSchedule('');
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih mata pelajaran" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Semua Mata Pelajaran</SelectItem>
                {subjects.map((subject) => (
                  <SelectItem key={subject.id} value={subject.id}>
                    {subject.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Jadwal</label>
            <Select 
              value={selectedSchedule} 
              onValueChange={setSelectedSchedule}
              disabled={!selectedSubject}
            >
              <SelectTrigger>
                <SelectValue placeholder={selectedSubject ? 'Pilih jadwal' : 'Pilih mata pelajaran terlebih dahulu'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Semua Jadwal</SelectItem>
                {filteredSchedules.map((schedule) => (
                  <SelectItem key={schedule.id} value={schedule.id}>
                    {`${schedule.dayOfWeek}, ${schedule.startTime} - ${schedule.endTime}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Tanggal</label>
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
        </div>
        
        <div className="mt-4">
          <Button onClick={loadData}>Refresh Data</Button>
        </div>
      </Card>

      <div className="data-table-container">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tanggal</TableHead>
              <TableHead>Mata Pelajaran</TableHead>
              <TableHead>Nama Siswa</TableHead>
              <TableHead>Waktu Presensi</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAttendances.length > 0 ? (
              filteredAttendances.map((attendance) => (
                <TableRow key={attendance.id}>
                  <TableCell>{attendance.date}</TableCell>
                  <TableCell>{getSubjectName(attendance.subjectId)}</TableCell>
                  <TableCell>{getStudentName(attendance.studentId)}</TableCell>
                  <TableCell>{formatTime(attendance.timestamp)}</TableCell>
                  <TableCell>
                    <StatusBadge status={attendance.status} />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  Tidak ada data presensi yang ditemukan
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AttendancePage;
