import React, { useState, useEffect, useRef } from 'react';
import { 
  QrCode, 
  ArrowRight, 
  Smartphone, 
  Printer, 
  CheckCircle,
  Camera,
  User,
  Calendar,
  MapPin,
  Phone,
  DollarSign,
  Scan,
  X
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const QRCodeDemo: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showScanner, setShowScanner] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [showCustomerInfo, setShowCustomerInfo] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const demoRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  // Auto-advance steps for the first few seconds
  useEffect(() => {
    if (currentStep < 1) {
      const timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  const handleStepChange = (newStep: number) => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setCurrentStep(newStep);
    
    // Reset animation state after transition
    setTimeout(() => {
      setIsAnimating(false);
    }, 300);
  };

  const handleScannerDemo = () => {
    setShowScanner(true);
    
    // Simulate scanning after a delay
    setTimeout(() => {
      setScanResult("Customer: John Smith");
      
      // Show customer info after scan
      setTimeout(() => {
        setShowScanner(false);
        setShowCustomerInfo(true);
      }, 1500);
    }, 2000);
  };

  const steps = [
    {
      title: t('landing.qr.step1.title'),
      description: t('landing.qr.step1.description'),
      icon: QrCode,
      action: () => {},
      actionText: "Generate QR Code"
    },
    {
      title: t('landing.qr.step2.title'),
      description: t('landing.qr.step2.description'),
      icon: Printer,
      action: () => {},
      actionText: "Print QR Code"
    },
    {
      title: t('landing.qr.step3.title'),
      description: t('landing.qr.step3.description'),
      icon: Camera,
      action: handleScannerDemo,
      actionText: "Try Scanning Demo"
    }
  ];

  // Sample customer data for QR code demo
  const sampleCustomer = {
    name: "John Smith",
    phone: "(555) 123-4567",
    address: "123 Main St, Anytown, USA",
    serviceType: "Lawn Care"
  };

  return (
    <section id="qr-demo" className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-700 dark:to-purple-700 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center text-white mb-12">
          <QrCode className="h-16 w-16 mx-auto mb-6 opacity-90" />
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            {t('landing.qr.title')}
          </h2>
          <p className="text-xl opacity-90 mb-12 max-w-3xl mx-auto leading-relaxed">
            {t('landing.qr.subtitle')}
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 text-left">
            {steps.map((step, index) => (
              <div 
                key={index}
                className={`bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 transition-all duration-300 transform ${
                  currentStep === index ? 'scale-105 ring-2 ring-white/50' : 'scale-100'
                } cursor-pointer`}
                onClick={() => handleStepChange(index)}
              >
                <div className="bg-white/20 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold">{index + 1}</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="opacity-90 mb-4">{step.description}</p>
                
                {step.action && index === currentStep && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      step.action();
                    }}
                    className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors flex items-center text-sm"
                  >
                    {step.actionText}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* Interactive Demo Area */}
        <div 
          ref={demoRef}
          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 max-w-2xl mx-auto"
        >
          <div className="text-center text-white">
            <h3 className="text-xl font-semibold mb-4">See It In Action</h3>
            <p className="text-sm opacity-80 mb-6">
              Experience how QR codes transform your workflow. Click the button below to try a live demo.
            </p>
            
            <button
              onClick={handleScannerDemo}
              className="bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-colors flex items-center mx-auto"
            >
              <Smartphone className="mr-2 h-5 w-5" />
              Try Interactive Demo
            </button>
          </div>
        </div>
      </div>
      
      {/* Scanner Demo Modal */}
      {showScanner && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-dark-800 rounded-2xl max-w-md w-full overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Scan className="h-6 w-6 mr-3" />
                  <div>
                    <h2 className="text-xl font-bold">QR Code Scanner</h2>
                    <p className="text-blue-100 text-sm">Scanning...</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowScanner(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* Scanner View */}
            <div className="p-6">
              <div className="relative bg-black rounded-lg overflow-hidden mb-4" style={{ aspectRatio: '1' }}>
                {/* Simulated camera view */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black">
                  {/* Scanning animation */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    {scanResult ? (
                      <div className="bg-green-100 dark:bg-green-900/30 rounded-full w-16 h-16 flex items-center justify-center animate-pulse">
                        <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                      </div>
                    ) : (
                      <div className="w-48 h-48 border-2 border-white rounded-lg relative">
                        {/* Corner indicators */}
                        <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-blue-400 rounded-tl-lg"></div>
                        <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-blue-400 rounded-tr-lg"></div>
                        <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-blue-400 rounded-bl-lg"></div>
                        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-blue-400 rounded-br-lg"></div>
                        
                        {/* Scanning line animation */}
                        <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent" style={{
                          animation: 'scanline 2s ease-in-out infinite',
                          top: '0%'
                        }}></div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Status Text */}
              <div className="text-center">
                <p className="text-gray-700 dark:text-gray-300 text-lg font-medium">
                  {scanResult || "Position QR code within the frame"}
                </p>
                {scanResult && (
                  <p className="text-green-600 dark:text-green-400 text-sm mt-2">
                    QR code scanned successfully!
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Customer Info Modal */}
      {showCustomerInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-dark-800 rounded-2xl max-w-md w-full overflow-hidden shadow-2xl" style={{
            animation: 'slideIn 0.3s ease-out'
          }}>
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <User className="h-6 w-6 mr-3" />
                  <div>
                    <h2 className="text-xl font-bold">{sampleCustomer.name}</h2>
                    <p className="text-blue-100 text-sm">{sampleCustomer.serviceType} • Regular Customer</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowCustomerInfo(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* Customer Details */}
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-gray-400 dark:text-gray-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Phone Number</p>
                    <p className="font-medium text-blue-600 dark:text-blue-400">
                      {sampleCustomer.phone}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-gray-400 dark:text-gray-500 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Service Address</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {sampleCustomer.address}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-gray-400 dark:text-gray-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Next Service</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      July 15, 2025 - Lawn Mowing
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <DollarSign className="h-5 w-5 text-gray-400 dark:text-gray-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Payment Status</p>
                    <p className="font-medium text-orange-600 dark:text-orange-400">
                      $75.00 Unpaid
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  onClick={() => setShowCustomerInfo(false)}
                  className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Job
                </button>
                
                <button
                  onClick={() => setShowCustomerInfo(false)}
                  className="bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center"
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Call Customer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute top-1/3 -right-24 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute -bottom-24 left-1/3 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      </div>
    </section>
  );
};

export default QRCodeDemo;