import React, { useState } from 'react';
import { 
  Share2, 
  Copy, 
  Mail, 
  MessageSquare, 
  Facebook, 
  Twitter, 
  Linkedin,
  QrCode,
  CheckCircle,
  X,
  ExternalLink,
  Users,
  Star,
  Smartphone
} from 'lucide-react';
import QRCodeDisplay from './QRCodeDisplay';

interface ShareAppProps {
  onClose?: () => void;
  className?: string;
  variant?: 'button' | 'modal' | 'inline';
}

const ShareApp: React.FC<ShareAppProps> = ({ 
  onClose, 
  className = '', 
  variant = 'button' 
}) => {
  const [showModal, setShowModal] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState(false);

  const appUrl = 'https://myjobtrack.app';
  const appName = 'MyJobTrack';
  
  const shareMessage = `Check out ${appName} - Simple CRM built for landscapers, handymen & service professionals! Track jobs, manage customers, and get paid faster. No complexity, just what you need to run your business. ${appUrl}`;
  
  const shortMessage = `Try ${appName} - Simple CRM for service professionals! ${appUrl}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(appUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  const handleCopyMessage = async () => {
    try {
      await navigator.clipboard.writeText(shareMessage);
      setCopiedMessage(true);
      setTimeout(() => setCopiedMessage(false), 2000);
    } catch (error) {
      console.error('Failed to copy message:', error);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: appName,
          text: 'Simple CRM for service professionals',
          url: appUrl,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    }
  };

  const shareOptions = [
    {
      name: 'Email',
      icon: Mail,
      color: 'bg-blue-600 hover:bg-blue-700',
      action: () => {
        const subject = encodeURIComponent(`Check out ${appName} - Simple CRM for Service Professionals`);
        const body = encodeURIComponent(shareMessage);
        window.open(`mailto:?subject=${subject}&body=${body}`);
      }
    },
    {
      name: 'SMS',
      icon: MessageSquare,
      color: 'bg-green-600 hover:bg-green-700',
      action: () => {
        const message = encodeURIComponent(shortMessage);
        window.open(`sms:?body=${message}`);
      }
    },
    {
      name: 'WhatsApp',
      icon: MessageSquare,
      color: 'bg-green-500 hover:bg-green-600',
      action: () => {
        const message = encodeURIComponent(shareMessage);
        window.open(`https://wa.me/?text=${message}`);
      }
    },
    {
      name: 'Twitter',
      icon: Twitter,
      color: 'bg-blue-400 hover:bg-blue-500',
      action: () => {
        const text = encodeURIComponent(`Check out ${appName} - Simple CRM for service professionals! Perfect for landscapers, handymen & contractors.`);
        const url = encodeURIComponent(appUrl);
        window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`);
      }
    },
    {
      name: 'Facebook',
      icon: Facebook,
      color: 'bg-blue-600 hover:bg-blue-700',
      action: () => {
        const url = encodeURIComponent(appUrl);
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`);
      }
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      color: 'bg-blue-700 hover:bg-blue-800',
      action: () => {
        const url = encodeURIComponent(appUrl);
        const title = encodeURIComponent(`${appName} - Simple CRM for Service Professionals`);
        const summary = encodeURIComponent('Simple CRM built for landscapers, handymen & contractors. Track jobs, manage customers, get paid faster.');
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}&title=${title}&summary=${summary}`);
      }
    }
  ];

  const ShareContent = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Share2 className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Share MyJobTrack
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Help other service professionals discover this simple CRM
        </p>
      </div>

      {/* Native Share (Mobile) */}
      {navigator.share && (
        <button
          onClick={handleNativeShare}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 px-6 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl"
        >
          <Share2 className="h-5 w-5 mr-2" />
          Share App
        </button>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={handleCopyLink}
          className={`flex items-center justify-center py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
            copiedLink 
              ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800' 
              : 'bg-gray-100 dark:bg-dark-700 hover:bg-gray-200 dark:hover:bg-dark-600 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-dark-600'
          }`}
        >
          {copiedLink ? (
            <>
              <CheckCircle className="h-4 w-4 mr-2" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="h-4 w-4 mr-2" />
              Copy Link
            </>
          )}
        </button>

        <button
          onClick={() => setShowQRCode(true)}
          className="flex items-center justify-center py-3 px-4 bg-gray-100 dark:bg-dark-700 hover:bg-gray-200 dark:hover:bg-dark-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors duration-200 border border-gray-300 dark:border-dark-600"
        >
          <QrCode className="h-4 w-4 mr-2" />
          QR Code
        </button>
      </div>

      {/* Share Message */}
      <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-4 border border-gray-200 dark:border-dark-600">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-semibold text-gray-900 dark:text-white">Share Message</h3>
          <button
            onClick={handleCopyMessage}
            className={`text-sm px-3 py-1 rounded-md font-medium transition-all duration-200 ${
              copiedMessage
                ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200'
                : 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-900/30'
            }`}
          >
            {copiedMessage ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
          {shareMessage}
        </p>
      </div>

      {/* Social Share Options */}
      <div>
        <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Share On</h3>
        <div className="grid grid-cols-3 gap-3">
          {shareOptions.map((option) => (
            <button
              key={option.name}
              onClick={option.action}
              className={`${option.color} text-white py-3 px-4 rounded-lg font-medium transition-all duration-200 flex flex-col items-center space-y-1 shadow-md hover:shadow-lg`}
            >
              <option.icon className="h-5 w-5" />
              <span className="text-xs">{option.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Why Share */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2 flex items-center">
          <Users className="h-4 w-4 mr-2" />
          Why Share MyJobTrack?
        </h3>
        <ul className="text-blue-800 dark:text-blue-200 space-y-1 text-sm">
          <li className="flex items-start">
            <Star className="h-3 w-3 mr-2 mt-0.5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
            Help fellow service professionals get organized
          </li>
          <li className="flex items-start">
            <Smartphone className="h-3 w-3 mr-2 mt-0.5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
            It's completely free and works offline
          </li>
          <li className="flex items-start">
            <CheckCircle className="h-3 w-3 mr-2 mt-0.5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
            No complexity - just simple job tracking
          </li>
        </ul>
      </div>

      {/* App Link */}
      <div className="text-center">
        <a
          href={appUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-sm transition-colors duration-200"
        >
          {appUrl}
          <ExternalLink className="h-3 w-3 ml-1" />
        </a>
      </div>
    </div>
  );

  if (variant === 'button') {
    return (
      <>
        <button
          onClick={() => setShowModal(true)}
          className={`flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg font-medium transition-colors duration-200 ${className}`}
        >
          <Share2 className="h-4 w-4 mr-2" />
          Share App
        </button>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-black dark:bg-opacity-70 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-dark-800 rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200 dark:border-dark-700">
              <div className="p-6">
                <div className="flex justify-end mb-4">
                  <button
                    onClick={() => setShowModal(false)}
                    className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg transition-colors duration-200"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <ShareContent />
              </div>
            </div>
          </div>
        )}

        {/* QR Code Modal */}
        {showQRCode && (
          <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-black dark:bg-opacity-70 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-dark-800 rounded-lg p-6 max-w-sm w-full shadow-2xl border border-gray-200 dark:border-dark-700">
              <div className="text-center mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Share MyJobTrack</h2>
                <p className="text-gray-600 dark:text-gray-400">Scan to visit the app</p>
              </div>

              <div className="text-center mb-6">
                <div className="bg-white p-4 rounded-lg border-2 border-blue-200 dark:border-blue-700 inline-block">
                  <div className="w-48 h-48 bg-gray-100 dark:bg-dark-600 rounded flex items-center justify-center">
                    <QrCode className="h-16 w-16 text-gray-400 dark:text-gray-500" />
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
                  {appUrl}
                </p>
              </div>

              <button
                onClick={() => setShowQRCode(false)}
                className="w-full py-3 px-4 bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-dark-600 transition-colors duration-200"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  if (variant === 'inline') {
    return (
      <div className={className}>
        <ShareContent />
      </div>
    );
  }

  // Modal variant
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-black dark:bg-opacity-70 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-dark-800 rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200 dark:border-dark-700">
        <div className="p-6">
          {onClose && (
            <div className="flex justify-end mb-4">
              <button
                onClick={onClose}
                className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg transition-colors duration-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          )}
          <ShareContent />
        </div>
      </div>
    </div>
  );
};

export default ShareApp;