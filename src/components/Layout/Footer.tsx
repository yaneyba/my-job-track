import React from 'react';
import { Heart, ExternalLink } from 'lucide-react';
import Logo from '@/components/UI/Logo';
import BuildInfoDisplay from '@/components/UI/BuildInfoDisplay';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <div className="mb-4">
              <Logo 
                size="md" 
                variant="horizontal" 
                theme="white" 
                showTagline={true}
                tagline="Simple Job Tracking for Service Providers"
                clickable={true}
              />
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Streamline your service business with powerful customer management, 
              job scheduling, and QR code integration. Built for landscapers, 
              cleaners, handymen, and all service professionals.
            </p>
            <div className="flex items-center text-gray-400 text-sm">
              <span>Made with</span>
              <Heart className="h-4 w-4 mx-1 text-red-500" />
              <span>for service providers</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="/app" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Dashboard
                </a>
              </li>
              <li>
                <a href="/app/customers" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Customers
                </a>
              </li>
              <li>
                <a href="/app/jobs" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Jobs
                </a>
              </li>
              <li>
                <a href="/app/payments" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Payments
                </a>
              </li>
              <li>
                <a href="/app/scan" className="text-gray-300 hover:text-white transition-colors text-sm">
                  QR Scanner
                </a>
              </li>
            </ul>
          </div>

          {/* Features */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Features</h4>
            <ul className="space-y-2">
              <li className="text-gray-300 text-sm">Customer Management</li>
              <li className="text-gray-300 text-sm">Job Scheduling</li>
              <li className="text-gray-300 text-sm">Payment Tracking</li>
              <li className="text-gray-300 text-sm">QR Code Integration</li>
              <li className="text-gray-300 text-sm">Mobile-First Design</li>
              <li className="text-gray-300 text-sm">Offline Support</li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © {currentYear} MyJobTrack. All rights reserved.
            </div>
            
            <div className="flex items-center space-x-6">
              <span className="text-gray-400 text-sm">
                Built for service professionals
              </span>
              <div className="flex items-center space-x-4">
                <button className="text-gray-400 hover:text-white transition-colors text-sm">
                  Privacy
                </button>
                <button className="text-gray-400 hover:text-white transition-colors text-sm">
                  Terms
                </button>
                <button className="text-gray-400 hover:text-white transition-colors text-sm flex items-center">
                  Help
                  <ExternalLink className="h-3 w-3 ml-1" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* App Info Bar */}
      <div className="bg-gray-800 border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-col sm:flex-row justify-between items-center text-xs text-gray-400">
            <div className="flex items-center space-x-4 mb-2 sm:mb-0">
              <span>📱 Mobile Optimized</span>
              <span>🔒 Data Stored Locally</span>
              <span>⚡ Works Offline</span>
            </div>
            <div className="flex items-center space-x-2">
              <BuildInfoDisplay variant="footer" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;