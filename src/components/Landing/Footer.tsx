import React from 'react';
import Logo from '@/components/UI/Logo';
import { BUILD_INFO } from '@/build-info';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 dark:bg-dark-950 py-12 transition-colors duration-200 relative">
      <div className="max-w-7xl mx-auto px-4">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Logo and Description */}
          <div>
            <Logo
              size="md"
              variant="horizontal"
              theme="white"
              clickable={false}
              className="mb-4"
            />
            <p className="text-gray-400 text-sm">
              Built for service providers who value simplicity and speed.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="#features" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Features
                </a>
              </li>
              <li>
                <a href="#faq" className="text-gray-400 hover:text-white transition-colors text-sm">
                  FAQ
                </a>
              </li>
              <li>
                <a href="/app" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Get Started
                </a>
              </li>
            </ul>
          </div>

          {/* Support & Legal */}
          <div>
            <h3 className="text-white font-semibold mb-4">Support & Legal</h3>
            <ul className="space-y-2">
              <li>
                <a href="mailto:support@myjobtrack.app" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Contact Support
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} MyJobTrack. All rights reserved.
            </p>
            <p className="text-gray-500 text-xs mt-2 md:mt-0">
              Made with ❤️ for service professionals
            </p>
          </div>
        </div>

        {/* Build hash - bottom left corner */}
        <div className="absolute bottom-2 left-4 text-xs text-gray-600 opacity-50">
          {BUILD_INFO.gitHash}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
