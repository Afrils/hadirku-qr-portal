
import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { dbService } from '@/services/dbService';

type DatabaseErrorProps = {
  onRetry: () => void;
  error?: string;
};

const DatabaseError: React.FC<DatabaseErrorProps> = ({ onRetry, error }) => {
  const handleInitializeDatabase = async () => {
    try {
      await dbService.initDatabase();
      onRetry();
    } catch (err) {
      console.error('Error initializing database:', err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 text-amber-500">
            <AlertTriangle className="h-6 w-6" />
            <span>Gagal Memuat Data</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-muted-foreground">
            Terjadi kesalahan saat menghubungkan ke database. Database mungkin belum diinisialisasi atau tabel belum dibuat.
          </p>
          
          {error && (
            <div className="bg-gray-50 p-3 rounded-md text-sm font-mono text-gray-700 overflow-auto max-h-[200px]">
              {error}
            </div>
          )}
          
          <div className="flex flex-col gap-2">
            <Button 
              variant="default"
              onClick={handleInitializeDatabase}
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Inisialisasi Database
            </Button>
            
            <Button 
              variant="outline"
              onClick={onRetry}
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Coba Lagi
            </Button>
          </div>
          
          <p className="text-xs text-muted-foreground text-center mt-4">
            Pastikan database Supabase telah dikonfigurasi dengan benar dan tabel yang diperlukan telah dibuat.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DatabaseError;
