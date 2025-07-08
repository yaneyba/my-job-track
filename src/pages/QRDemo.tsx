import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  QrCode, 
  ArrowRight, 
  ArrowLeft, 
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
import QRCodeDisplay from '@/components/QR/QRCodeDisplay';

const QRDemo: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showQRCode, setShowQRCode] = useState(false);
  const [demoComplete, setDemoComplete] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [showCustomerInfo, setShowCustomerInfo] = useState(false);
  const navigate = useNavigate();
  const slideRef = useRef<HTMLDivElement>(null);

  // Auto-advance slides for the first few seconds
  useEffect(() => {
    if (currentSlide < 1) {
      const timer = setTimeout(() => {
        setCurrentSlide(prev => prev + 1);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [currentSlide]);

  const handleSlideChange = (newSlide: number) => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    
    // Slide out current slide
    if (slideRef.current) {
      slideRef.current.classList.add('translate-x-full', 'opacity-0');
    }
    
    // Wait for animation to complete
    setTimeout(() => {
      setCurrentSlide(newSlide);
      
      // Reset animation state
      setTimeout(() => {
        if (slideRef.current) {
          slideRef.current.classList.remove('translate-x-full', 'opacity-0');
        }
        setIsAnimating(false);
      }, 50);
    }, 300);
  };

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      handleSlideChange(currentSlide + 1);
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      handleSlideChange(currentSlide - 1);
    }
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

  const slides = [
    {
      title: "Revolutionary QR Code Integration",
      description: "Generate, place, and scan QR codes for instant access to customer and job information.",
      icon: QrCode,
      color: "bg-gradient-to-r from-blue-600 to-purple-600",
      textColor: "text-white",
      animation: "animate-pulse"
    },
    {
      title: "Step 1: Generate QR Codes",
      description: "Create unique QR codes for each customer and job directly from their detail pages.",
      icon: QrCode,
      color: "bg-blue-50 dark:bg-blue-900/20",
      textColor: "text-blue-900 dark:text-blue-100",
      action: () => setShowQRCode(true),
      actionText: "Generate Sample QR Code",
      animation: "animate-bounce"
    },
    {
      title: "Step 2: Print & Place QR Codes",
      description: "Print QR codes and place them at customer locations, equipment, or job sites for easy access.",
      icon: Printer,
      color: "bg-green-50 dark:bg-green-900/20",
      textColor: "text-green-900 dark:text-green-100",
      animation: "animate-bounce"
    },
    {
      title: "Step 3: Scan On-Site",
      description: "Use the built-in scanner to instantly access customer information and job details when you arrive.",
      icon: Camera,
      color: "bg-purple-50 dark:bg-purple-900/20",
      textColor: "text-purple-900 dark:text-purple-100",
      action: handleScannerDemo,
      actionText: "Try Scanning Demo",
      animation: "animate-bounce"
    },
    {
      title: "Step 4: Instant Access",
      description: "View customer details, update job status, and mark jobs as complete - all with a single scan.",
      icon: Smartphone,
      color: "bg-orange-50 dark:bg-orange-900/20",
      textColor: "text-orange-900 dark:text-orange-100",
      animation: "animate-bounce"
    },
    {
      title: "Ready to Try It Yourself?",
      description: "Experience the power of QR code integration in MyJobTrack.",
      icon: CheckCircle,
      color: "bg-gradient-to-r from-green-600 to-blue-600",
      textColor: "text-white",
      action: () => {
        setDemoComplete(true);
        setTimeout(() => navigate('/app/scan'), 1500);
      },
      actionText: "Try QR Scanner Now",
      animation: "animate-pulse"
    }
  ];

  // Sample customer data for QR code demo
  const sampleCustomer = {
    id: "demo-customer",
    name: "John Smith",
    phone: "(555) 123-4567",
    address: "123 Main St, Anytown, USA",
    serviceType: "Lawn Care"
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 flex flex-col transition-colors duration-200">
      {/* Header */}
      <div className="bg-white dark:bg-dark-800 shadow-sm border-b border-gray-200 dark:border-dark-700 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <button 
            onClick={() => navigate('/app')}
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white transition-colors duration-200">
            QR Code Demo
          </h1>
          <div className="w-6"></div> {/* Spacer for alignment */}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-3xl w-full">
          {/* Progress Indicator */}
          <div className="mb-8 flex justify-center">
            <div className="flex space-x-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleSlideChange(index)}
                  className={`h-3 w-${index === currentSlide ? '12' : '8'} rounded-full transition-all duration-300 ${
                    index === currentSlide 
                      ? 'bg-blue-600 dark:bg-blue-500' 
                      : index < currentSlide 
                        ? 'bg-blue-300 dark:bg-blue-700' 
                        : 'bg-gray-200 dark:bg-dark-700'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Slide Content */}
          <div 
            ref={slideRef}
            className={`${slides[currentSlide].color} rounded-2xl p-8 shadow-lg transition-all duration-500 transform ${
              demoComplete ? 'scale-105 opacity-0' : 'scale-100 opacity-100'
            }`}
          >
            <div className="flex flex-col items-center text-center">
              <div className={`p-4 bg-white dark:bg-dark-800 rounded-full shadow-md mb-6 ${slides[currentSlide].animation}`}>
                {React.createElement(slides[currentSlide].icon, { 
                  className: "h-12 w-12 text-blue-600 dark:text-blue-400" 
                })}
              </div>
              <h2 className={`text-2xl font-bold mb-4 ${slides[currentSlide].textColor}`}>
                {slides[currentSlide].title}
              </h2>
              <p className={`text-lg mb-8 max-w-md ${
                slides[currentSlide].color.includes('gradient') 
                  ? 'text-white/90' 
                  : slides[currentSlide].textColor.replace('900', '700').replace('100', '300')
              }`}>
                {slides[currentSlide].description}
              </p>
              
              {slides[currentSlide].action && (
                <button
                  onClick={slides[currentSlide].action}
                  className="bg-white dark:bg-dark-800 text-blue-600 dark:text-blue-400 px-6 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-200 flex items-center"
                >
                  {slides[currentSlide].actionText}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
              )}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <button
              onClick={handlePrev}
              disabled={currentSlide === 0 || isAnimating}
              className={`p-3 rounded-full ${
                currentSlide === 0 || isAnimating
                  ? 'bg-gray-200 dark:bg-dark-700 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                  : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50'
              } transition-colors duration-200`}
              aria-label="Previous slide"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <button
              onClick={handleNext}
              disabled={currentSlide === slides.length - 1 || isAnimating}
              className={`p-3 rounded-full ${
                currentSlide === slides.length - 1 || isAnimating
                  ? 'bg-gray-200 dark:bg-dark-700 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                  : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50'
              } transition-colors duration-200`}
              aria-label="Next slide"
            >
              <ArrowRight className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* QR Code Modal */}
      {showQRCode && (
        <QRCodeDisplay
          type="customer"
          id={sampleCustomer.id}
          title={sampleCustomer.name}
          subtitle={`${sampleCustomer.serviceType} • ${sampleCustomer.phone}`}
          onClose={() => setShowQRCode(false)}
        />
      )}

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
                        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-[scanline_2s_ease-in-out_infinite]"></div>
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
          <div className="bg-white dark:bg-dark-800 rounded-2xl max-w-md w-full overflow-hidden shadow-2xl animate-[slideIn_0.3s_ease-out]">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <User className="h-6 w-6 mr-3" />
                  <div>
                    <h2 className="text-xl font-bold">John Smith</h2>
                    <p className="text-blue-100 text-sm">Lawn Care • Regular Customer</p>
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
                      (555) 123-4567
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-gray-400 dark:text-gray-500 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Service Address</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      123 Main St, Anytown, USA
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
    </div>
  );
};

export default QRDemo;