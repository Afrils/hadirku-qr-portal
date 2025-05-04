
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAppContext } from '@/contexts/AppContext';
import { generateQRData } from '@/utils/qrCodeUtils';
import QRCodeGenerator from '@/components/QRCodeGenerator';

const QRGeneratorPage = () => {
  const { subjects, schedules, getSubjectById } = useAppContext();
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedSchedule, setSelectedSchedule] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [qrCodeData, setQrCodeData] = useState<string | null>(null);

  // Filter schedules based on selected subject
  const filteredSchedules = selectedSubject 
    ? schedules.filter(schedule => schedule.subjectId === selectedSubject)
    : [];

  const handleGenerateQR = () => {
    if (selectedSchedule && selectedSubject && selectedDate) {
      const qrData = generateQRData(selectedSchedule, selectedSubject, selectedDate);
      setQrCodeData(qrData);
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
    
    const subject = getSubjectById(selectedSubject);
    const schedule = schedules.find(s => s.id === selectedSchedule);
    
    if (!subject || !schedule) return 'QR Code Presensi';
    
    return `Presensi ${subject.name} - ${formatDateForDisplay(selectedDate)}`;
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
                      <SelectItem value="none" disabled>
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
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QRGeneratorPage;
