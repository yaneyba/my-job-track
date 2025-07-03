import React from 'react';
import { QrCode } from 'lucide-react';

const QRCodeShowcase: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-700 dark:to-purple-700">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center text-white">
          <QrCode className="h-16 w-16 mx-auto mb-6 opacity-90" />
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Revolutionary QR Code Integration
          </h2>
          <p className="text-xl opacity-90 mb-12 max-w-3xl mx-auto leading-relaxed">
            Generate QR codes for customers and jobs. Stick them on properties, 
            scan on-site for instant access. It's like magic for your workflow.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 text-left">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="bg-white/20 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Generate QR Codes</h3>
              <p className="opacity-90">Create unique QR codes for each customer and job automatically.</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="bg-white/20 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Place On-Site</h3>
              <p className="opacity-90">Print and stick QR codes at customer properties for easy access.</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="bg-white/20 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Scan & Work</h3>
              <p className="opacity-90">Scan to instantly access customer info and mark jobs complete.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default QRCodeShowcase;
