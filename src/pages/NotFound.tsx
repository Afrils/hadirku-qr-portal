
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

const NotFound = ({ message = "Halaman tidak ditemukan" }: { message?: string }) => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-md">
        <div className="flex justify-center mb-4">
          <AlertCircle className="h-16 w-16 text-red-500" />
        </div>
        <h1 className="text-4xl font-bold mb-2 text-red-500">404</h1>
        <p className="text-xl text-gray-700 mb-6">{message}</p>
        <p className="text-sm text-gray-500 mb-6">
          Terjadi kesalahan saat mengakses halaman ini. 
          Silahkan kembali ke halaman utama.
        </p>
        <Button asChild>
          <Link to="/" className="w-full">
            Kembali ke Halaman Utama
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
