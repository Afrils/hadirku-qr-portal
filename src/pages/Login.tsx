
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { AlertCircle, Loader2 } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import DatabaseError from '@/components/DatabaseError';
import { supabase } from '@/integrations/supabase/client';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { login, isLoading, hasError, databaseError, retryDatabaseConnection } = useAppContext();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Email dan password tidak boleh kosong');
      return;
    }

    setIsLoggingIn(true);
    
    try {
      const user = await login(email, password);
      if (user && user.role) {
        toast.success(`Berhasil login sebagai ${user.role}`);
        navigate('/');
      } else {
        toast.error('Email atau password salah');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Gagal login. Silakan coba lagi.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  // If there's a database loading error, show the error component
  if (hasError) {
    return (
      <DatabaseError 
        onRetry={retryDatabaseConnection}
        error={databaseError || undefined}
      />
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-4">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <img
                src="/placeholder.svg"
                alt="Logo"
                className="h-16 w-16"
              />
            </div>
            <h1 className="text-2xl font-semibold">HadirKu</h1>
            <p className="text-gray-500">Aplikasi Presensi Elektronik</p>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin mb-2 text-primary" />
                <p className="text-sm text-muted-foreground">Menghubungkan ke database...</p>
              </div>
            ) : (
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">Email</label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Masukkan email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium">Password</label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Masukkan password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoggingIn}
                >
                  {isLoggingIn ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sedang Login...
                    </>
                  ) : (
                    'Login'
                  )}
                </Button>
              </form>
            )}
          </CardContent>
          <CardFooter className="flex flex-col items-center">
            <div className="text-xs text-center text-gray-500 space-y-1">
              <p className="font-medium">Demo Credentials:</p>
              <p><strong>Admin:</strong> andikabgs@gmail.com | Password: G4l4xymini</p>
              <p><strong>Admin:</strong> admin@example.com | Password: admin123</p>
              <p><strong>Guru:</strong> siti.rahayu@example.com | Password: 123456</p>
              <p><strong>Murid:</strong> ahmad.farizi@example.com | Password: 123456</p>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
