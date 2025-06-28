import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataProviderFactory } from '@/data/providers/DataProviderFactory';
import QrScanner from 'qr-scanner';
import { 
  X, 
  AlertCircle, 
  CheckCircle, 
  RotateCcw, 
  Flashlight,
  FlashlightOff,
  Scan,
  User,
  Calendar
} from 'lucide-react';

interface QRScannerProps {
  onClose: () => void;
  onScanSuccess?: (data: QRData) => void;
}

interface QRData {
  type: 'customer' | 'job';
  id: string;
  url: string;
  name?: string;
  phone?: string;
  customerId?: string;
  serviceType?: string;
}

const QRScanner: React.FC<QRScannerProps> = ({ onClose, onScanSuccess }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [error, setError] = useState<string>('');
  const [scanResult, setScanResult] = useState<QRData | null>(null);
  const [isFlashlightOn, setIsFlashlightOn] = useState(false);
  const [cameras, setCameras] = useState<QrScanner.Camera[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const scannerRef = useRef<QrScanner | null>(null);
  const navigate = useNavigate();
  const dataProvider = DataProviderFactory.getInstance();

  const cleanup = () => {
    stopScanning();
    if (isFlashlightOn) {
      toggleFlashlight();
    }
  };

  const initializeScanner = async () => {
    try {
      // Check if camera is available
      const hasCamera = await QrScanner.hasCamera();
      if (!hasCamera) {
        setError('No camera found on this device');
        setHasPermission(false);
        return;
      }

      // Get available cameras
      const availableCameras = await QrScanner.listCameras(true);
      setCameras(availableCameras);
      
      if (availableCameras.length > 0) {
        // Prefer back camera if available
        const backCamera = availableCameras.find(camera => 
          camera.label.toLowerCase().includes('back') || 
          camera.label.toLowerCase().includes('rear')
        );
        setSelectedCamera(backCamera?.id || availableCameras[0].id);
      }

      setHasPermission(true);
      startScanning();
    } catch (err) {
      console.error('Failed to initialize scanner:', err);
      setError('Failed to access camera. Please check permissions.');
      setHasPermission(false);
    }
  };

  useEffect(() => {
    initializeScanner();
    return () => {
      cleanup();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startScanning = async () => {
    if (!videoRef.current) return;

    try {
      setIsScanning(true);
      setError('');

      const scanner = new QrScanner(
        videoRef.current,
        (result) => handleScanResult(result.data),
        {
          onDecodeError: (err) => {
            // Ignore decode errors - they're normal when no QR code is visible
            console.debug('Decode error:', err);
          },
          highlightScanRegion: true,
          highlightCodeOutline: true,
          preferredCamera: selectedCamera || 'environment',
          maxScansPerSecond: 5,
        }
      );

      scannerRef.current = scanner;
      await scanner.start();
    } catch (err) {
      console.error('Failed to start scanner:', err);
      setError('Failed to start camera. Please check permissions and try again.');
      setIsScanning(false);
    }
  };

  const stopScanning = () => {
    if (scannerRef.current) {
      scannerRef.current.stop();
      scannerRef.current.destroy();
      scannerRef.current = null;
    }
    setIsScanning(false);
  };

  const handleScanResult = async (data: string) => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    
    try {
      // Try to parse the QR code data
      let qrData: QRData;
      
      try {
        qrData = JSON.parse(data);
      } catch {
        // If it's not JSON, treat it as a simple URL or text
        setError('Invalid QR code format. Please scan a MyJobTrack QR code.');
        setIsProcessing(false);
        return;
      }

      // Validate QR code structure
      if (!qrData.type || !qrData.id || (qrData.type !== 'customer' && qrData.type !== 'job')) {
        setError('This QR code is not from MyJobTrack.');
        setIsProcessing(false);
        return;
      }

      // Verify the data exists in our system
      if (qrData.type === 'customer') {
        const customer = dataProvider.getCustomer(qrData.id);
        if (!customer) {
          setError('Customer not found in your system.');
          setIsProcessing(false);
          return;
        }
        qrData.name = customer.name;
        qrData.phone = customer.phone;
      } else if (qrData.type === 'job') {
        const job = dataProvider.getJob(qrData.id);
        if (!job) {
          setError('Job not found in your system.');
          setIsProcessing(false);
          return;
        }
        qrData.serviceType = job.serviceType;
        qrData.customerId = job.customerId;
      }

      setScanResult(qrData);
      stopScanning();
      onScanSuccess?.(qrData);
    } catch (err) {
      console.error('Error processing scan result:', err);
      setError('Failed to process QR code. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleFlashlight = async () => {
    if (!scannerRef.current) return;

    try {
      if (isFlashlightOn) {
        await scannerRef.current.turnFlashOff();
        setIsFlashlightOn(false);
      } else {
        await scannerRef.current.turnFlashOn();
        setIsFlashlightOn(true);
      }
    } catch (err) {
      console.error('Failed to toggle flashlight:', err);
    }
  };

  const switchCamera = async () => {
    if (cameras.length <= 1) return;

    const currentIndex = cameras.findIndex(camera => camera.id === selectedCamera);
    const nextIndex = (currentIndex + 1) % cameras.length;
    const nextCamera = cameras[nextIndex];

    setSelectedCamera(nextCamera.id);
    
    if (scannerRef.current) {
      try {
        await scannerRef.current.setCamera(nextCamera.id);
      } catch (err) {
        console.error('Failed to switch camera:', err);
      }
    }
  };

  const handleNavigateToResult = () => {
    if (!scanResult) return;

    if (scanResult.type === 'customer') {
      navigate(`/app/customers/${scanResult.id}`);
    } else if (scanResult.type === 'job') {
      navigate(`/app/jobs/${scanResult.id}`);
    }
    onClose();
  };

  const resetScanner = () => {
    setScanResult(null);
    setError('');
    setIsProcessing(false);
    startScanning();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Scan className="h-6 w-6 mr-3" />
              <div>
                <h2 className="text-xl font-bold">QR Code Scanner</h2>
                <p className="text-blue-100 text-sm">Scan MyJobTrack QR codes</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {hasPermission === null ? (
            /* Loading */
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Initializing camera...</p>
            </div>
          ) : hasPermission === false ? (
            /* No Permission */
            <div className="text-center py-8">
              <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Camera Access Required</h3>
              <p className="text-gray-600 mb-6">
                Please allow camera access to scan QR codes. Check your browser settings and try again.
              </p>
              <button
                onClick={initializeScanner}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : scanResult ? (
            /* Scan Result */
            <div className="text-center py-4">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">QR Code Scanned!</h3>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-center mb-2">
                  {scanResult.type === 'customer' ? (
                    <User className="h-5 w-5 text-blue-600 mr-2" />
                  ) : (
                    <Calendar className="h-5 w-5 text-green-600 mr-2" />
                  )}
                  <span className="text-sm font-medium text-gray-600 capitalize">
                    {scanResult.type}
                  </span>
                </div>
                
                <p className="font-semibold text-gray-900">
                  {scanResult.type === 'customer' ? scanResult.name : scanResult.serviceType}
                </p>
                
                {scanResult.phone && (
                  <p className="text-sm text-gray-600 mt-1">{scanResult.phone}</p>
                )}
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={handleNavigateToResult}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
                >
                  View Details
                </button>
                <button
                  onClick={resetScanner}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-medium transition-colors"
                >
                  Scan Again
                </button>
              </div>
            </div>
          ) : (
            /* Scanner Interface */
            <div>
              {/* Camera View */}
              <div className="relative bg-black rounded-lg overflow-hidden mb-4" style={{ aspectRatio: '1' }}>
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  playsInline
                  muted
                />
                
                {/* Scanning Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    {/* Scanning Frame */}
                    <div className="w-48 h-48 border-2 border-white rounded-lg relative">
                      {/* Corner indicators */}
                      <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-blue-400 rounded-tl-lg"></div>
                      <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-blue-400 rounded-tr-lg"></div>
                      <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-blue-400 rounded-bl-lg"></div>
                      <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-blue-400 rounded-br-lg"></div>
                      
                      {/* Scanning line animation */}
                      {isScanning && (
                        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-pulse"></div>
                      )}
                    </div>
                    
                    {/* Instructions */}
                    <p className="text-white text-center mt-4 text-sm bg-black/50 px-3 py-1 rounded-full">
                      {isProcessing ? 'Processing...' : 'Position QR code within the frame'}
                    </p>
                  </div>
                </div>

                {/* Camera Controls */}
                <div className="absolute bottom-4 left-4 right-4 flex justify-center space-x-4">
                  {/* Flashlight Toggle */}
                  <button
                    onClick={toggleFlashlight}
                    className="bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors"
                    title={isFlashlightOn ? 'Turn off flashlight' : 'Turn on flashlight'}
                  >
                    {isFlashlightOn ? (
                      <FlashlightOff className="h-5 w-5" />
                    ) : (
                      <Flashlight className="h-5 w-5" />
                    )}
                  </button>

                  {/* Camera Switch */}
                  {cameras.length > 1 && (
                    <button
                      onClick={switchCamera}
                      className="bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors"
                      title="Switch camera"
                    >
                      <RotateCcw className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center">
                    <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                    <p className="text-red-800 text-sm">{error}</p>
                  </div>
                </div>
              )}

              {/* Instructions */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">How to scan:</h4>
                <ul className="text-blue-800 text-sm space-y-1">
                  <li>• Hold your device steady</li>
                  <li>• Position the QR code within the frame</li>
                  <li>• Ensure good lighting for best results</li>
                  <li>• Only MyJobTrack QR codes will work</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QRScanner;