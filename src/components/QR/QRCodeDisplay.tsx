import React, { useState, useEffect } from 'react';
import { DataProviderFactory } from '@/data/providers/DataProviderFactory';
import { Printer, Download } from 'lucide-react';

interface QRCodeDisplayProps {
  type: 'customer' | 'job';
  id: string;
  title: string;
  subtitle?: string;
  onClose: () => void;
}

const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({
  type,
  id,
  title,
  subtitle,
  onClose,
}) => {
  const [qrCodeData, setQrCodeData] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const dataProvider = DataProviderFactory.getInstance();

  useEffect(() => {
    const generateQRCode = async () => {
      try {
        let qrData: string;
        if (type === 'customer') {
          qrData = await dataProvider.generateCustomerQRCode(id);
        } else {
          qrData = await dataProvider.generateJobQRCode(id);
        }
        setQrCodeData(qrData);
      } catch (error) {
        console.error('Failed to generate QR code:', error);
      } finally {
        setLoading(false);
      }
    };

    generateQRCode();
  }, [type, id, dataProvider]);

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>QR Code - ${title}</title>
            <style>
              body { 
                font-family: Arial, sans-serif; 
                text-align: center; 
                padding: 20px;
                margin: 0;
              }
              .qr-container {
                border: 2px solid #2563eb;
                border-radius: 12px;
                padding: 20px;
                display: inline-block;
                background: white;
              }
              h1 { color: #2563eb; margin-bottom: 10px; }
              p { color: #666; margin-bottom: 20px; }
              img { max-width: 200px; height: auto; }
            </style>
          </head>
          <body>
            <div class="qr-container">
              <h1>${title}</h1>
              ${subtitle ? `<p>${subtitle}</p>` : ''}
              <img src="${qrCodeData}" alt="QR Code" />
              <p style="margin-top: 20px; font-size: 12px;">
                Scan this code for quick access
              </p>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.download = `qr-code-${type}-${id}.png`;
    link.href = qrCodeData;
    link.click();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-black dark:bg-opacity-70 flex items-center justify-center p-4 z-50 transition-colors duration-200">
      <div className="bg-white dark:bg-dark-800 rounded-lg p-6 max-w-sm w-full shadow-2xl border border-gray-200 dark:border-dark-700 transition-colors duration-200">
        <div className="text-center mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 transition-colors duration-200">{title}</h2>
          {subtitle && <p className="text-gray-600 dark:text-gray-400 transition-colors duration-200">{subtitle}</p>}
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400"></div>
          </div>
        ) : (
          <div className="text-center mb-6">
            <img
              src={qrCodeData}
              alt="QR Code"
              className="mx-auto mb-4 border-2 border-blue-200 dark:border-blue-700 rounded-lg transition-colors duration-200"
            />
            <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">
              Scan this code for quick access
            </p>
          </div>
        )}

        <div className="flex space-x-3 mb-4">
          <button
            onClick={handlePrint}
            disabled={loading}
            className="flex-1 flex items-center justify-center py-3 px-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <Printer size={18} className="mr-2" />
            Print
          </button>
          <button
            onClick={handleDownload}
            disabled={loading}
            className="flex-1 flex items-center justify-center py-3 px-4 bg-gray-600 hover:bg-gray-700 dark:bg-gray-500 dark:hover:bg-gray-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <Download size={18} className="mr-2" />
            Download
          </button>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 px-4 bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-dark-600 transition-colors duration-200"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default QRCodeDisplay;