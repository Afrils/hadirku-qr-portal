import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useAppContext } from '@/contexts/AppContext';
import { Pencil, Trash, Download } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import * as XLSX from 'xlsx';
import { Student } from '@/types/dataTypes';
import ExcelImporter from '@/components/ExcelImporter';
import { toast } from '@/components/ui/sonner';

const studentSchema = z.object({
  name: z.string().min(3, 'Nama harus minimal 3 karakter'),
  studentId: z.string().min(5, 'NIS harus minimal 5 karakter'),
  class: z.string().min(1, 'Kelas harus diisi'),
  email: z.string().email('Format email tidak valid'),
});

type StudentFormData = z.infer<typeof studentSchema>;

const Students = () => {
  const { students, addStudent, updateStudent, deleteStudent, isLoading } = useAppContext();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [studentToDelete, setStudentToDelete] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: keyof Student; direction: 'asc' | 'desc' } | null>(null);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const itemsPerPage = 10;
  
  const form = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      name: '',
      studentId: '',
      class: '',
      email: '',
    },
  });

  const resetForm = () => {
    form.reset();
    setIsEditMode(false);
    setCurrentId(null);
  };

  const handleOpenDialog = (edit = false, student = null) => {
    resetForm();
    if (edit && student) {
      setIsEditMode(true);
      setCurrentId(student.id);
      form.reset({
        name: student.name,
        studentId: student.studentId,
        class: student.class,
        email: student.email,
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    resetForm();
  };

  const onSubmit = async (data: StudentFormData) => {
    try {
      console.log("Submitting student data:", data);
      
      // Memastikan semua field required terisi
      const studentData: Omit<Student, 'id'> = {
        name: data.name,
        studentId: data.studentId,
        class: data.class,
        email: data.email,
        password: '123456' // Default password for new students
      };
      
      if (isEditMode && currentId) {
        await updateStudent(currentId, studentData);
        toast.success('Data siswa berhasil diperbarui');
      } else {
        await addStudent(studentData);
        toast.success('Siswa berhasil ditambahkan');
      }
      handleCloseDialog();
    } catch (error) {
      console.error('Error submitting student data:', error);
      toast.error('Gagal menambahkan siswa: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const exportToExcel = () => {
    const data = students.map(student => ({
      'NIS': student.studentId,
      'Nama': student.name,
      'Kelas': student.class,
      'Email': student.email
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Daftar Siswa');
    XLSX.writeFile(wb, 'daftar-siswa.xlsx');
  };

  const handleImportStudents = async (data: any[]) => {
    try {
      // Track successful and failed imports
      let successCount = 0;
      let failedCount = 0;
      
      for (const row of data) {
        try {
          // Map Excel columns to student data format
          const studentData: Omit<Student, 'id'> = {
            name: row['Nama'] || '',
            studentId: row['NIS']?.toString() || '',
            class: row['Kelas'] || '',
            email: row['Email'] || '',
          };
          
          // Validate the data
          if (!studentData.name || !studentData.studentId || !studentData.class || !studentData.email) {
            failedCount++;
            continue;
          }
          
          // Add the student
          await addStudent(studentData);
          successCount++;
        } catch (error) {
          console.error('Error importing student row:', error);
          failedCount++;
        }
      }
      
      // Show summary toast
      if (successCount > 0) {
        toast.success(`Berhasil mengimpor ${successCount} data siswa`);
      }
      if (failedCount > 0) {
        toast.error(`Gagal mengimpor ${failedCount} data siswa`);
      }
    } catch (error) {
      console.error('Error during import:', error);
      toast.error('Terjadi kesalahan saat mengimpor data');
    }
  }

  const generateTemplateData = () => {
    return [
      {
        'NIS': '12345',
        'Nama': 'Nama Siswa',
        'Kelas': 'X-1',
        'Email': 'siswa@example.com'
      }
    ];
  };

  const handleDelete = (id: string) => {
    setStudentToDelete(id);
  };

  const confirmDelete = () => {
    if (studentToDelete) {
      deleteStudent(studentToDelete);
      setStudentToDelete(null);
    } else if (selectedStudents.length > 0) {
      selectedStudents.forEach(id => deleteStudent(id));
      setSelectedStudents([]);
    }
  };

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.class.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedStudents = React.useMemo(() => {
    let sortableItems = [...filteredStudents];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [filteredStudents, sortConfig]);

  const handleSort = (key: keyof Student) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === 'asc'
    ) {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const paginatedStudents = sortedStudents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center gap-4">
        <h2 className="text-3xl font-bold tracking-tight">Manajemen Siswa</h2>
        <div className="flex gap-2">
          <ExcelImporter
            onImport={handleImportStudents}
            generateTemplate={generateTemplateData}
            templateFileName="template-siswa.xlsx"
            dialogTitle="Import Data Siswa"
            dialogDescription="Unggah data siswa dari file Excel. Unduh template terlebih dahulu untuk format yang benar."
          />
          <Button
            variant="outline"
            onClick={exportToExcel}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export Excel
          </Button>
          <Button onClick={() => handleOpenDialog()}>Tambah Siswa</Button>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <Input
          placeholder="Cari siswa..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        {selectedStudents.length > 0 && (
          <Button
            variant="destructive"
            onClick={() => setStudentToDelete('')}
            className="flex items-center gap-2"
          >
            <Trash className="h-4 w-4" />
            Hapus {selectedStudents.length} item
          </Button>
        )}
      </div>

      <div className="data-table-container">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <input
                  type="checkbox"
                  className="h-4 w-4"
                  checked={selectedStudents.length === paginatedStudents.length && paginatedStudents.length > 0}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedStudents(paginatedStudents.map(s => s.id));
                    } else {
                      setSelectedStudents([]);
                    }
                  }}
                />
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  className="hover:bg-transparent"
                  onClick={() => handleSort('studentId')}
                >
                  NIS
                  {sortConfig?.key === 'studentId' && (
                    <span className="ml-2">
                      {sortConfig.direction === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  className="hover:bg-transparent"
                  onClick={() => handleSort('name')}
                >
                  Nama
                  {sortConfig?.key === 'name' && (
                    <span className="ml-2">
                      {sortConfig.direction === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  className="hover:bg-transparent"
                  onClick={() => handleSort('class')}
                >
                  Kelas
                  {sortConfig?.key === 'class' && (
                    <span className="ml-2">
                      {sortConfig.direction === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  className="hover:bg-transparent"
                  onClick={() => handleSort('email')}
                >
                  Email
                  {sortConfig?.key === 'email' && (
                    <span className="ml-2">
                      {sortConfig.direction === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </Button>
              </TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedStudents.length > 0 ? (
              paginatedStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>
                    <input
                      type="checkbox"
                      className="h-4 w-4"
                      checked={selectedStudents.includes(student.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedStudents([...selectedStudents, student.id]);
                        } else {
                          setSelectedStudents(selectedStudents.filter(id => id !== student.id));
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell>{student.studentId}</TableCell>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.class}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleOpenDialog(true, student)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(student.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  Tidak ada data siswa yang ditemukan
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                onClick={() => setCurrentPage(page)}
                className="w-10"
              >
                {page}
              </Button>
            ))}
          </div>
          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}

      <AlertDialog 
        open={!!studentToDelete || selectedStudents.length > 0} 
        onOpenChange={(open) => {
          if (!open) {
            setStudentToDelete(null);
            setSelectedStudents([]);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Hapus Data</AlertDialogTitle>
            <AlertDialogDescription>
              {selectedStudents.length > 0
                ? `Apakah Anda yakin ingin menghapus ${selectedStudents.length} data siswa yang dipilih?`
                : 'Apakah Anda yakin ingin menghapus data siswa ini?'}
              Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditMode ? 'Edit Siswa' : 'Tambah Siswa'}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="studentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>NIS</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="class"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kelas</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleCloseDialog}>
                  Batal
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isEditMode ? 'Simpan' : 'Tambah'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Students;
