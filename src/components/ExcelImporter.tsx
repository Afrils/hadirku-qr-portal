
import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Download, Upload, Loader2 } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

interface ExcelImporterProps {
  onImport: (data: any[]) => Promise<void>;
  generateTemplate: () => any[];
  templateFileName: string;
  dialogTitle: string;
  dialogDescription: string;
}

const ExcelImporter: React.FC<ExcelImporterProps> = ({
  onImport,
  generateTemplate,
  templateFileName,
  dialogTitle,
  dialogDescription,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleImport = async () => {
    if (!file) {
      toast.error('Pilih file terlebih dahulu');
      return;
    }

    try {
      setIsLoading(true);
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          
          // Validate data before importing
          if (jsonData.length === 0) {
            toast.error('Data Excel kosong');
            setIsLoading(false);
            return;
          }
          
          await onImport(jsonData);
          setIsDialogOpen(false);
          setFile(null);
          toast.success('Data berhasil diimpor');
        } catch (error) {
          console.error('Error processing Excel file:', error);
          toast.error('Format file Excel tidak valid');
        } finally {
          setIsLoading(false);
        }
      };
      
      reader.readAsArrayBuffer(file);
    } catch (error) {
      console.error('Error importing data:', error);
      toast.error('Gagal mengimpor data');
      setIsLoading(false);
    }
  };

  const downloadTemplate = () => {
    try {
      const templateData = generateTemplate();
      const worksheet = XLSX.utils.json_to_sheet(templateData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Template');
      XLSX.writeFile(workbook, templateFileName);
      toast.success('Template berhasil diunduh');
    } catch (error) {
      console.error('Error generating template:', error);
      toast.error('Gagal mengunduh template');
    }
  };

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setIsDialogOpen(true)}
        className="flex items-center gap-2"
      >
        <Upload className="h-4 w-4" />
        Import Excel
      </Button>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{dialogTitle}</DialogTitle>
            <DialogDescription>{dialogDescription}</DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <Button 
              variant="outline" 
              onClick={downloadTemplate}
              className="flex items-center gap-2 w-full"
            >
              <Download className="h-4 w-4" />
              Download Template
            </Button>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Upload File Excel</label>
              <Input
                type="file"
                accept=".xlsx, .xls"
                onChange={handleFileChange}
                className="cursor-pointer"
              />
              <p className="text-xs text-muted-foreground">
                Format: .xlsx atau .xls
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleImport} disabled={!file || isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Mengimpor...
                </>
              ) : (
                'Import'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ExcelImporter;
