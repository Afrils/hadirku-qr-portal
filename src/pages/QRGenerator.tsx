
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAppContext } from '@/contexts/AppContext';
import { generateQRData } from '@/utils/qrCodeUtils';
import QRCodeGenerator from '@/components/QRCodeGenerator';
import { dbService } from '@/services/dbService';
import { toast } from '@/components/ui/sonner';
import { Subject } from '@/types/dataTypes';

const QRGeneratorPage = () => {
  const { subjects, schedules, getSubjectById } = useAppContext();
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedSchedule, setSelectedSchedule] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [qrCodeData, setQrCodeData] = useState<string | null>(null);
  const [subjectDetails, setSubjectDetails] = useState<Subject | null>(null);

  // Filter schedules based on selected subject
  const filteredSchedules = selectedSubject 
    ? schedules.filter(schedule => schedule.subjectId === selectedSubject)
    : [];

  // Fetch subject details when selectedSubject changes
  useEffect(() => {
    const fetchSubjectDetails = async () => {
      if (selectedSubject) {
        const subject = await getSubjectById(selectedSubject);
        setSubjectDetails(subject);
      } else {
        setSubjectDetails(null);
      }
    };

    fetchSubjectDetails();
  }, [selectedSubject, getSubjectById]);

  const handleGenerateQR = () => {
    if (selectedSchedule && selectedSubject && selectedDate) {
      const qrData = generateQRData(selectedSchedule, selectedSubject, selectedDate);
      setQrCodeData(qrData);
      
      // Create a test attendance record when QR is generated (simulating scanning)
      setTimeout(async () => {
        try {
          // Create attendance records for students - properly handling the promise
          const students = await dbService.getAllStudents();
          const sampleStudents = students.slice(0, 2); // Just use first two students
          
          sampleStudents.forEach((student, index) => {
            const delay = index * 2000; // Stagger the attendance records by 2 seconds
            
            setTimeout(() => {
              dbService.createAttendance({
                studentId: student.id,
                scheduleId: selectedSchedule,
                subjectId: selectedSubject,
                date: selectedDate,
                status: index === 0 ? 'present' : 'late',
                timestamp: new Date(new Date().getTime() + delay).toISOString(),
              });
              
              toast.success(`Presensi ${student.name} berhasil dicatat`);
            }, delay);
          });
        } catch (error) {
          console.error('Error creating test attendance records', error);
        }
      }, 2000);
    }
  };

  const formatDateForDisplay = (dateString: string) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  // Get subject details for the QR code title
  const getQRTitle = () => {
    if (!selectedSubject || !selectedSchedule || !selectedDate) return 'QR Code Presensi';
    
    return subjectDetails 
      ? `Presensi ${subjectDetails.name} - ${formatDateForDisplay(selectedDate)}`
      : 'QR Code Presensi';
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Generator QR Code Presensi</h2>
      
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="subject">Mata Pelajaran</Label>
                <Select 
                  value={selectedSubject} 
                  onValueChange={(value) => {
                    setSelectedSubject(value);
                    setSelectedSchedule('');
                    setQrCodeData(null);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih mata pelajaran" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject) => (
                      <SelectItem key={subject.id} value={subject.id}>
                        {subject.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="schedule">Jadwal</Label>
                <Select 
                  value={selectedSchedule} 
                  onValueChange={(value) => {
                    setSelectedSchedule(value);
                    setQrCodeData(null);
                  }}
                  disabled={!selectedSubject}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={selectedSubject ? 'Pilih jadwal' : 'Pilih mata pelajaran terlebih dahulu'} />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredSchedules.length > 0 ? (
                      filteredSchedules.map((schedule) => (
                        <SelectItem key={schedule.id} value={schedule.id}>
                          {`${schedule.dayOfWeek}, ${schedule.startTime} - ${schedule.endTime}, Ruang ${schedule.roomNumber}`}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-schedules" disabled>
                        Tidak ada jadwal tersedia
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Tanggal</Label>
                <Input
                  id="date"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => {
                    setSelectedDate(e.target.value);
                    setQrCodeData(null);
                  }}
                />
              </div>

              <Button 
                className="w-full mt-4" 
                onClick={handleGenerateQR}
                disabled={!selectedSubject || !selectedSchedule || !selectedDate}
              >
                Generate QR Code
              </Button>
            </div>
          </CardContent>
        </Card>

        <div>
          {qrCodeData ? (
            <QRCodeGenerator 
              data={qrCodeData} 
              title={getQRTitle()}
              size={250}
            />
          ) : (
            <div className="flex items-center justify-center h-full min-h-[300px] bg-white rounded-lg border border-border p-4 text-muted-foreground">
              Isi form untuk generate QR Code presensi
            </div>
          )}
        </div>
      </div>

      <div className="mt-6">
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-2">Panduan Penggunaan:</h3>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Pilih mata pelajaran dari daftar.</li>
              <li>Pilih jadwal kelas yang sesuai.</li>
              <li>Pilih tanggal pertemuan.</li>
              <li>Klik tombol "Generate QR Code" untuk membuat QR code presensi.</li>
              <li>Tampilkan QR Code kepada siswa untuk dipindai dengan aplikasi mobile HadirKu.</li>
              <li>QR Code hanya berlaku untuk 15 menit demi keamanan.</li>
              <li>Gunakan tombol "Print" untuk mencetak QR code atau "Download" untuk menyimpannya.</li>
              <li><strong>Demo Mode:</strong> Saat QR code dibuat, sistem akan otomatis mensimulasikan 2 siswa melakukan presensi.</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QRGeneratorPage;
