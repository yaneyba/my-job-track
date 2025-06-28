import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import QRScanner from '../components/QR/QRScanner';
import Breadcrumbs from '../components/UI/Breadcrumbs';
import { 
  QrCode, 
  Camera, 
  Smartphone, 
  CheckCircle, 
  ArrowRight,
  User,
  Calendar,
  Zap
} from 'lucide-react';

const ScanQR: React.FC = () => {
  const [showScanner, setShowScanner] = useState(false);
  const navigate = useNavigate();

  const breadcrumbItems = [
    { label: 'Home', href: '/app' },
    { label: 'Scan QR Code', current: true }
  ];

  const features = [
    {
      icon: User,
      title: 'Customer QR Codes',
      description: 'Scan customer QR codes to instantly access their profile, contact info, and service history.'
    },
    {
      icon: Calendar,
      title: 'Job QR Codes',
      description: 'Scan job QR codes to view job details, update status, and mark jobs as complete.'
    },
    {
      icon: Zap,
      title: 'Instant Access',
      description: 'No typing required - scan and go directly to the information you need.'
    }
  ];

  const handleScanSuccess = (data: any) => {
    // Scanner component will handle navigation
    setShowScanner(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Breadcrumbs */}
      <div className="mb-6">
        <Breadcrumbs items={breadcrumbItems} />
      </div>

      {/* Header */}
      <div className="text-center mb-8">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <QrCode className="h-10 w-10 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          QR Code Scanner
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Scan MyJobTrack QR codes to instantly access customer profiles and job details. 
          Perfect for on-site work and quick information lookup.
        </p>
      </div>

      {/* Main Scanner Button */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-8 text-center">
        <Camera className="h-16 w-16 text-blue-600 mx-auto mb-6" />
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Ready to Scan
        </h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Click the button below to open your camera and start scanning QR codes. 
          Make sure to allow camera access when prompted.
        </p>
        
        <button
          onClick={() => setShowScanner(true)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center mx-auto group"
        >
          <Camera className="h-6 w-6 mr-3" />
          Start Scanning
          <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {features.map((feature, index) => (
          <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="bg-blue-100 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
              <feature.icon className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {feature.title}
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              {feature.description}
            </p>
          </div>
        ))}
      </div>

      {/* How It Works */}
      <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          How QR Code Scanning Works
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
              1
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Generate QR Codes</h3>
            <p className="text-gray-600 text-sm">
              Create QR codes for customers and jobs from their detail pages. Print and place them on-site.
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
              2
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Scan On-Site</h3>
            <p className="text-gray-600 text-sm">
              Use this scanner to scan QR codes when you arrive at customer locations or need quick access.
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
              3
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Instant Access</h3>
            <p className="text-gray-600 text-sm">
              Get immediate access to customer info, job details, and the ability to update job status.
            </p>
          </div>
        </div>
      </div>

      {/* Tips Section */}
      <div className="mt-8 bg-amber-50 border border-amber-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-amber-900 mb-3 flex items-center">
          <Smartphone className="h-5 w-5 mr-2" />
          Scanning Tips
        </h3>
        <ul className="text-amber-800 space-y-2 text-sm">
          <li className="flex items-start">
            <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-amber-600" />
            Ensure good lighting for best scanning results
          </li>
          <li className="flex items-start">
            <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-amber-600" />
            Hold your device steady and position the QR code within the frame
          </li>
          <li className="flex items-start">
            <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-amber-600" />
            Only MyJobTrack QR codes will work with this scanner
          </li>
          <li className="flex items-start">
            <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-amber-600" />
            Use the flashlight button if scanning in low light conditions
          </li>
        </ul>
      </div>

      {/* QR Scanner Modal */}
      {showScanner && (
        <QRScanner
          onClose={() => setShowScanner(false)}
          onScanSuccess={handleScanSuccess}
        />
      )}
    </div>
  );
};

export default ScanQR;