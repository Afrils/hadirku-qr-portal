
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAppContext } from '@/contexts/AppContext';
import { Pencil, Trash } from 'lucide-react';

const daysOfWeek = [
  'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'
];

const Schedules = () => {
  const { schedules, teachers, subjects, addSchedule, updateSchedule, deleteSchedule, getTeacherById, getSubjectById } = useAppContext();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [formData, setFormData] = useState({
    subjectId: '',
    teacherId: '',
    dayOfWeek: '',
    startTime: '',
    endTime: '',
    roomNumber: '',
  });

  const resetForm = () => {
    setFormData({
      subjectId: '',
      teacherId: '',
      dayOfWeek: '',
      startTime: '',
      endTime: '',
      roomNumber: '',
    });
    setIsEditMode(false);
    setCurrentId(null);
  };

  const handleOpenDialog = (edit = false, schedule = null) => {
    resetForm();
    if (edit && schedule) {
      setIsEditMode(true);
      setCurrentId(schedule.id);
      setFormData({
        subjectId: schedule.subjectId,
        teacherId: schedule.teacherId,
        dayOfWeek: schedule.dayOfWeek,
        startTime: schedule.startTime,
        endTime: schedule.endTime,
        roomNumber: schedule.roomNumber,
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    resetForm();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditMode && currentId) {
      updateSchedule(currentId, formData);
    } else {
      addSchedule(formData);
    }
    handleCloseDialog();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus jadwal ini?')) {
      deleteSchedule(id);
    }
  };

  const filteredSchedules = schedules.filter((schedule) => {
    const subject = getSubjectById(schedule.subjectId);
    const teacher = getTeacherById(schedule.teacherId);
    
    return (
      (subject && subject.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (teacher && teacher.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      schedule.dayOfWeek.toLowerCase().includes(searchTerm.toLowerCase()) ||
      schedule.roomNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Manajemen Jadwal</h2>
        <Button onClick={() => handleOpenDialog()}>Tambah Jadwal</Button>
      </div>

      <div className="flex items-center mb-4">
        <Input
          placeholder="Cari jadwal..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="data-table-container">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Hari</TableHead>
              <TableHead>Mata Pelajaran</TableHead>
              <TableHead>Guru</TableHead>
              <TableHead>Waktu</TableHead>
              <TableHead>Ruang</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSchedules.length > 0 ? (
              filteredSchedules.map((schedule) => {
                const subject = getSubjectById(schedule.subjectId);
                const teacher = getTeacherById(schedule.teacherId);
                return (
                  <TableRow key={schedule.id}>
                    <TableCell>{schedule.dayOfWeek}</TableCell>
                    <TableCell>{subject ? subject.name : 'Tidak ada'}</TableCell>
                    <TableCell>{teacher ? teacher.name : 'Tidak ada'}</TableCell>
                    <TableCell>{`${schedule.startTime} - ${schedule.endTime}`}</TableCell>
                    <TableCell>{schedule.roomNumber}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenDialog(true, schedule)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(schedule.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  Tidak ada jadwal yang ditemukan
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {isEditMode ? 'Edit Jadwal' : 'Tambah Jadwal Baru'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-2">
                <Label htmlFor="dayOfWeek" className="text-right">
                  Hari
                </Label>
                <Select 
                  value={formData.dayOfWeek} 
                  onValueChange={(value) => handleSelectChange('dayOfWeek', value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Pilih hari" />
                  </SelectTrigger>
                  <SelectContent>
                    {daysOfWeek.map((day) => (
                      <SelectItem key={day} value={day}>
                        {day}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-2">
                <Label htmlFor="subjectId" className="text-right">
                  Mata Pelajaran
                </Label>
                <Select 
                  value={formData.subjectId} 
                  onValueChange={(value) => handleSelectChange('subjectId', value)}
                >
                  <SelectTrigger className="col-span-3">
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
              <div className="grid grid-cols-4 items-center gap-2">
                <Label htmlFor="teacherId" className="text-right">
                  Guru
                </Label>
                <Select 
                  value={formData.teacherId} 
                  onValueChange={(value) => handleSelectChange('teacherId', value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Pilih guru" />
                  </SelectTrigger>
                  <SelectContent>
                    {teachers.map((teacher) => (
                      <SelectItem key={teacher.id} value={teacher.id}>
                        {teacher.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-2">
                <Label htmlFor="startTime" className="text-right">
                  Waktu Mulai
                </Label>
                <Input
                  id="startTime"
                  name="startTime"
                  type="time"
                  value={formData.startTime}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-2">
                <Label htmlFor="endTime" className="text-right">
                  Waktu Selesai
                </Label>
                <Input
                  id="endTime"
                  name="endTime"
                  type="time"
                  value={formData.endTime}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-2">
                <Label htmlFor="roomNumber" className="text-right">
                  Ruang
                </Label>
                <Input
                  id="roomNumber"
                  name="roomNumber"
                  value={formData.roomNumber}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" type="button" onClick={handleCloseDialog}>
                Batal
              </Button>
              <Button type="submit">Simpan</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Schedules;
