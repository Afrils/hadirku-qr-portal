
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider, useAppContext } from "./contexts/AppContext";

import MainLayout from "./components/MainLayout";

// Pages
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import Teachers from "./pages/Teachers";
import Subjects from "./pages/Subjects";
import Schedules from "./pages/Schedules";
import QRGenerator from "./pages/QRGenerator";
import Attendance from "./pages/Attendance";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Reports from "./pages/Reports";

// Protected route wrapper
const ProtectedRoute = ({ children, roles = [] }: { children: JSX.Element, roles?: string[] }) => {
  const { isAuthenticated, currentUser } = useAppContext();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  // If roles are specified, check if user has required role
  if (roles.length > 0 && currentUser && !roles.includes(currentUser.role)) {
    return <Navigate to="/" />;
  }
  
  return children;
};

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route path="/" element={
          <ProtectedRoute>
            <MainLayout>
              <Dashboard />
            </MainLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/students" element={
          <ProtectedRoute roles={['admin', 'teacher']}>
            <MainLayout>
              <Students />
            </MainLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/teachers" element={
          <ProtectedRoute roles={['admin']}>
            <MainLayout>
              <Teachers />
            </MainLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/subjects" element={
          <ProtectedRoute roles={['admin', 'teacher']}>
            <MainLayout>
              <Subjects />
            </MainLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/schedules" element={
          <ProtectedRoute>
            <MainLayout>
              <Schedules />
            </MainLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/qr-generator" element={
          <ProtectedRoute roles={['admin', 'teacher']}>
            <MainLayout>
              <QRGenerator />
            </MainLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/attendance" element={
          <ProtectedRoute>
            <MainLayout>
              <Attendance />
            </MainLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/reports" element={
          <ProtectedRoute>
            <MainLayout>
              <Reports />
            </MainLayout>
          </ProtectedRoute>
        } />
        
        <Route path="*" element={
          <ProtectedRoute>
            <MainLayout>
              <NotFound />
            </MainLayout>
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
};

const App = () => {
  // Create QueryClient instance
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AppRoutes />
        </TooltipProvider>
      </AppProvider>
    </QueryClientProvider>
  );
};

export default App;
