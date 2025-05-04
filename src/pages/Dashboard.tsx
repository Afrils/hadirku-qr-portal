
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppContext } from '@/contexts/AppContext';

const Dashboard = () => {
  const { students, teachers, subjects, schedules } = useAppContext();

  const stats = [
    { title: 'Total Siswa', value: students.length, icon: '👨‍🎓' },
    { title: 'Total Guru', value: teachers.length, icon: '👨‍🏫' },
    { title: 'Mata Pelajaran', value: subjects.length, icon: '📚' },
    { title: 'Jadwal', value: schedules.length, icon: '🗓️' }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index} className="stat-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className="text-2xl">{stat.icon}</div>
            </CardHeader>
            <CardContent>
              <div className="stat-value">{stat.value}</div>
              <p className="stat-label">Total</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Aktivitas Terbaru</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-blue-100 p-3">
                  <span className="text-blue-600">📝</span>
                </div>
                <div>
                  <p className="font-medium">Presensi Matematika</p>
                  <p className="text-sm text-muted-foreground">Kelas XII IPA 1 • 25 hadir, 2 tidak hadir</p>
                </div>
                <div className="ml-auto text-sm text-muted-foreground">
                  Hari ini
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-green-100 p-3">
                  <span className="text-green-600">➕</span>
                </div>
                <div>
                  <p className="font-medium">Jadwal Baru Ditambahkan</p>
                  <p className="text-sm text-muted-foreground">Fisika • Kelas XII IPA 2</p>
                </div>
                <div className="ml-auto text-sm text-muted-foreground">
                  Kemarin
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="rounded-full bg-amber-100 p-3">
                  <span className="text-amber-600">🔄</span>
                </div>
                <div>
                  <p className="font-medium">Perubahan Jadwal</p>
                  <p className="text-sm text-muted-foreground">Biologi • Pindah ke Ruang R105</p>
                </div>
                <div className="ml-auto text-sm text-muted-foreground">
                  2 hari lalu
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Jadwal Hari Ini</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Matematika</p>
                  <p className="text-sm text-muted-foreground">08:00 - 09:30 • Ruang R101</p>
                </div>
                <div className="text-sm bg-blue-100 text-blue-800 py-1 px-2 rounded">
                  Selesai
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Biologi</p>
                  <p className="text-sm text-muted-foreground">10:00 - 11:30 • Ruang R102</p>
                </div>
                <div className="text-sm bg-green-100 text-green-800 py-1 px-2 rounded">
                  Berlangsung
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Fisika</p>
                  <p className="text-sm text-muted-foreground">13:00 - 14:30 • Ruang R103</p>
                </div>
                <div className="text-sm bg-gray-100 text-gray-800 py-1 px-2 rounded">
                  Akan Datang
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Kimia</p>
                  <p className="text-sm text-muted-foreground">15:00 - 16:30 • Ruang R104</p>
                </div>
                <div className="text-sm bg-gray-100 text-gray-800 py-1 px-2 rounded">
                  Akan Datang
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
