
import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';

interface QRCodeGeneratorProps {
  data: string;
  title?: string;
  size?: number;
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ 
  data, 
  title = 'QR Code Presensi', 
  size = 256 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(
        canvasRef.current,
        data,
        {
          width: size,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF',
          },
        },
        (error) => {
          if (error) console.error('Error generating QR code:', error);
        }
      );
    }
  }, [data, size]);

  const handleDownload = () => {
    if (!canvasRef.current) return;
    
    const link = document.createElement('a');
    link.download = `${title.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  const handlePrint = () => {
    if (!canvasRef.current) return;
    
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    const qrCodeUrl = canvasRef.current.toDataURL('image/png');
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Print QR Code</title>
        <style>
          body {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
            margin: 0;
            font-family: Arial, sans-serif;
          }
          img {
            max-width: 80%;
            height: auto;
          }
          h2 {
            margin-bottom: 20px;
          }
        </style>
      </head>
      <body>
        <h2>${title}</h2>
        <img src="${qrCodeUrl}" alt="QR Code">
        <script>
          window.onload = function() {
            window.print();
            window.setTimeout(function() {
              window.close();
            }, 500);
          }
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <Card className="qr-code-container">
      <CardHeader>
        <CardTitle className="text-center">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center">
        <canvas ref={canvasRef} />
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={handlePrint}>Print</Button>
        <Button onClick={handleDownload} variant="outline">Download</Button>
      </CardFooter>
    </Card>
  );
};

export default QRCodeGenerator;
